export interface Box {
    id: string;
    name: string;
    contents: string;
    createdAt: number;
    roomId: string;
    userId: string;
}

export interface Room {
    id: string;
    name: string;
    createdAt: number;
    userId: string;
}
