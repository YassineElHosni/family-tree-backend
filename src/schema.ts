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
    Member.children: [uid] .
    Member.events: [uid] .
    Member.father: uid .
    Member.gender: string @index(hash) .
    Member.mother: uid .
    Member.firstName: string @index(fulltext) .
    Member.lastName: string @index(fulltext) .
    Member.partnerships: [uid] .
    MemberEvent.date: datetime @index(year) .
    MemberEvent.description: string .
    MemberEvent.eventType: string @index(hash) .
    MemberEvent.location: string .
    MemberEvent.member: uid .
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
    firstName: string @index(fulltext) .
    lastName: string @index(fulltext) .
    partner1: string @index(hash) .
    partner2: string @index(hash) .
    partnership: string @index(hash) .
    partnerships: [uid] .
    member: string @index(hash) .

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
    type Member {
        id
        firstName
        lastName
        gender
        events
        father
        mother
        partnerships
    }
    type MemberEvent {
        id
        eventType
        date
        location
        description
        member
    }
`

export default schema
