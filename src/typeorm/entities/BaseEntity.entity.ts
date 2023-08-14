import { Column, PrimaryGeneratedColumn, OneToMany, Entity } from 'typeorm';


/**
 * Default entity que contiene lo que cualquier entity debería de incluir
 * id, fechaCreacion y activo
 */
@Entity()
export abstract class BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id?: number;

    @Column({
        type: 'datetime',
        precision: 0,
        nullable: true,
        unique: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date;

    @Column({ type: 'boolean', nullable: false, unique: false, default: true })
    is_active?: boolean;

}
