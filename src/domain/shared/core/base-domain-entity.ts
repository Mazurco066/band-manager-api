export abstract class BaseDomainEntity {
  constructor(
    public created_at?: Date,
    public updated_at?: Date,
    public isDeleted?: boolean,
    public deleted_at?: Date
  ) {
    this.created_at = created_at ?? new Date()
    this.updated_at = updated_at ?? new Date()
    this.isDeleted = isDeleted ?? false
    this.deleted_at = isDeleted ? deleted_at : undefined
  }
}
