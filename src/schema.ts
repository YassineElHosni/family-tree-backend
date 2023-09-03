const schema: string = `
    Partnership.children: [uid] .
    Partnership.endDate: datetime .
    Partnership.events: [uid] .
    Partnership.partner1: uid .
    Partnership.partner2: uid .
    Partnership.startDate: datetime .
    PartnershipEvent.date: datetime @index(year) .
    PartnershipEvent.description: string .
    PartnershipEvent.eventType: string @index(hash) .
    PartnershipEvent.location: string @index(term) .
    PartnershipEvent.partnership: uid .
    Person.children: [uid] .
    Person.events: [uid] .
    Person.father: uid .
    Person.gender: string @index(hash) .
    Person.mother: uid .
    Person.name: string @index(fulltext) .
    Person.partnerships: [uid] .
    PersonEvent.date: datetime @index(year) .
    PersonEvent.description: string .
    PersonEvent.eventType: string @index(hash) .
    PersonEvent.location: string .
    PersonEvent.person: uid .
    children: [uid] .
    date: datetime @index(year) .
    description: string @index(hash) .
    eventType: string @index(hash) .
    events: [uid] .
    father: string @index(hash) .
    friend: [uid] @reverse .
    gender: string @index(hash) .
    id: string @index(hash) .
    location: string @index(hash) .
    mother: string @index(hash) .
    name: string @index(fulltext) .
    partner1: string @index(hash) .
    partner2: string @index(hash) .
    partnership: string @index(hash) .
    partnerships: [uid] .
    person: string @index(hash) .

    type Partnership {
        id
        partner1
        partner2
        events
        children
    }
    type PartnershipEvent {
        id
        eventType
        date
        location
        description
        partnership
    }
    type Person {
        id
        name
        gender
        events
        father
        mother
        partnerships
    }
    type PersonEvent {
        id
        eventType
        date
        location
        description
        person
    }
`

export default schema