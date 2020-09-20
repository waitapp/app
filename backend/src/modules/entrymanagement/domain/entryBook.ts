import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Result } from '../../../shared/core/logic/Result';
import { Guard } from '../../../shared/core/logic/Guard';
import { BookId } from './bookId';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { PatientStats } from './patientStats';

export interface PatientDetail {
  name: string;
  id?: string;
  address?: string;
  phone?: number | string;
  number?: number;
  type?: string;
}

interface PatientEntryBookProps {
  bookId?: BookId;
  patientList: PatientDetail[];
  donePatientList: PatientDetail[];
  undonePatientList: PatientDetail[];
  patientStats?: PatientStats;
}

export class EntryBook extends AggregateRoot<PatientEntryBookProps> {
  get bookId(): BookId {
    return BookId.create(this._id).getValue();
  }
  get patientList(): PatientDetail[] {
    return this.props.patientList;
  }
  get donePatientList(): PatientDetail[] {
    return this.props.donePatientList;
  }
  get undonePatientList(): PatientDetail[] {
    return this.props.undonePatientList;
  }

  get totalPatientNumber(): number {
    return (this.props.patientStats.props.totalPatientNumber = this.patientList.length);
  }

  get currentPatientNumber(): number {
    return this.props.patientStats.props.currentPatientNumber;
  }
  get currentPatientDetails(): PatientDetail {
    return (this.props.patientStats.props.currentPatientDetails = this.patientList[
      this.currentPatientNumber - 1
    ]);
  }

  constructor(props: PatientEntryBookProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: PatientEntryBookProps,
    id?: UniqueEntityID
  ): Result<EntryBook> {
    const isNewEntryBook = id ? false : true;

    const entryBook = new EntryBook({ ...props }, id);

    const guardResult = Guard.againstNullOrUndefined(entryBook, 'entryBook');
    if (!guardResult.succeeded)
      throw Result.fail<EntryBook>(guardResult.message);

    return Result.ok<EntryBook>(entryBook);
  }
  public static createDefault(id: string): Result<EntryBook> {
    const bookId = new UniqueEntityID(id);
    const defaultPatientStats = PatientStats.createDefault().getValue();

    const defaultPatientEntryBookProps: PatientEntryBookProps = {
      patientList: [],
      donePatientList: [],
      undonePatientList: [],
      patientStats: defaultPatientStats,
    };

    const defaultPatientEntryBook = new EntryBook(
      defaultPatientEntryBookProps,
      bookId
    );

    const guardResult = Guard.againstNullOrUndefined(
      defaultPatientEntryBook,
      'defaultPatientEntryBook'
    );
    if (!guardResult.succeeded)
      throw Result.fail<EntryBook>(guardResult.message);

    return Result.ok<EntryBook>(defaultPatientEntryBook);
  }

  public callNextEntry(): void {
    if (this.currentPatientNumber < this.totalPatientNumber) {
      this.updateCurrentPatientNumber();
    }
  }
  private updateCurrentPatientNumber(): void {
    this.props.patientStats.incrCurrentPatientNumber();
  }

  public addToDone(): void {
    this.donePatientList.push(this.currentPatientDetails);
  }
  public addToUndone(): void {
    this.undonePatientList.push(this.currentPatientDetails);
  }

  public createOfflineEntry(patientDetail: PatientDetail): void {
    patientDetail.number = this.totalPatientNumber + 1;

    if (
      this.sumOfDoneAndUndone() === this.totalPatientNumber &&
      this.currentPatientNumber === this.totalPatientNumber
    ) {
      this.updateCurrentPatientNumber();
    }
    this.patientList.push(patientDetail);
  }

  private sumOfDoneAndUndone(): number {
    return this.donePatientList.length + this.undonePatientList.length;
  }
}