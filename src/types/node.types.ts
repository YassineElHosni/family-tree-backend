export type NodeType = {
    id: string
    name: string
    birthday: Date
    father?: NodeType | null
    mother?: NodeType | null
    partner?: NodeType | null
    children?: NodeType[] | null
}
