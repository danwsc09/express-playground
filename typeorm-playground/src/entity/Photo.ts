import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity({name: 'photos'})
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100
  })
  name: string

  @Column('text')
  description: string

  @Column()
  filename: string

  @Column('bigint')
  views: number

  @Column()
  isPublished: boolean
}