const schema: string = `
    Relationship.children: [uid] .
    Relationship.endDate: datetime .
    Relationship.events: [uid] .
    Relationship.husband: uid .
    Relationship.wife: uid .
    Relationship.startDate: datetime .
    RelationshipEvent.date: datetime @index(year) .
    RelationshipEvent.description: string .
    RelationshipEvent.eventType: string @index(hash) .
    RelationshipEvent.location: string @index(term) .
    RelationshipEvent.relationship: uid .
    Member.children: [uid] .
    Member.events: [uid] .
    Member.father: uid .
    Member.gender: string @index(hash) .
    Member.mother: uid .
    Member.firstName: string @index(fulltext) .
    Member.lastName: string @index(fulltext) .
    Member.relationships: [uid] .
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
    husband: string @index(hash) .
    wife: string @index(hash) .
    relationship: string @index(hash) .
    relationships: [uid] .
    member: string @index(hash) .

    type Relationship {
        id
        husband
        wife
        events
        children
    }
    type RelationshipEvent {
        id
        eventType
        date
        location
        description
        relationship
    }
    type Member {
        id
        firstName
        lastName
        gender
        events
        father
        mother
        relationships
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
