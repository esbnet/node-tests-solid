import { describe, expect, it } from 'vitest'

import { Appointment } from '../entities/appointment'
import { getFutureDate } from '../tests/utils/get-future-date'
import { CreateAppointment } from './create-appointment'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointment-repository'

describe('Create Appointment', () => {
  it('should be able to create a new Appointment', () => {
    const startsAt = getFutureDate('2022-08-10')
    const endsAt = getFutureDate('2022-08-12')

    const appointmentsRpository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRpository)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt,
        endsAt
      })
    ).resolves.toBeInstanceOf(Appointment)
  })

  it('should not be able to create a new Appointment with overlapping dates', async () => {
    const startsAt = getFutureDate('2022-08-10')
    const endsAt = getFutureDate('2022-08-15')

    const appointmentsRpository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRpository)

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-14'),
        endsAt: getFutureDate('2022-08-18')
      })
    ).rejects.toBeInstanceOf(Error)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-08'),
        endsAt: getFutureDate('2022-08-12')
      })
    ).rejects.toBeInstanceOf(Error)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-08'),
        endsAt: getFutureDate('2022-08-17')
      })
    ).rejects.toBeInstanceOf(Error)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-11'),
        endsAt: getFutureDate('2022-08-12')
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
