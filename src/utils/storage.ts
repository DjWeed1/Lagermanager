import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Room } from '../types';

// Room Operations
export const getRooms = async (userId: string): Promise<Room[]> => {
    try {
        const roomsRef = collection(db, 'rooms');
        const q = query(roomsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
    } catch (e) {
        console.error('Error getting rooms', e);
        return [];
    }
};

export const addRoom = async (userId: string, name: string): Promise<Room | null> => {
    try {
        const roomData = {
            name,
            userId,
            createdAt: Date.now(),
        };
        const docRef = await addDoc(collection(db, 'rooms'), roomData);
        return { id: docRef.id, ...roomData };
    } catch (e) {
        console.error('Error adding room', e);
        return null;
    }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
    try {
        // Delete the room document
        await deleteDoc(doc(db, 'rooms', roomId));

        // Optional: Delete all boxes in the room
        // This requires querying and batch deleting, which is safer to do to avoid orphans.
        const boxes = await getBoxes(roomId);
        for (const box of boxes) {
            await deleteDoc(doc(db, 'boxes', box.id));
        }
    } catch (e) {
        console.error('Error deleting room', e);
    }
};

// Box Operations
export const getBoxes = async (roomId: string): Promise<Box[]> => {
    try {
        const boxesRef = collection(db, 'boxes');
        const q = query(boxesRef, where('roomId', '==', roomId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Box));
    } catch (e) {
        console.error('Error getting boxes', e);
        return [];
    }
};

export const saveBox = async (box: Pick<Box, 'name' | 'contents'>, roomId: string, userId: string): Promise<string | null> => {
    try {
        const boxData = {
            ...box,
            roomId,
            userId,
            createdAt: Date.now(),
        };
        const docRef = await addDoc(collection(db, 'boxes'), boxData);
        return docRef.id;
    } catch (e) {
        console.error('Error saving box', e);
        return null;
    }
};

export const getBoxById = async (id: string): Promise<Box | undefined> => {
    try {
        const docRef = doc(db, 'boxes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Box;
        } else {
            return undefined;
        }
    } catch (e) {
        console.error('Error getting box', e);
        return undefined;
    }
};

export const deleteBox = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'boxes', id));
    } catch (e) {
        console.error('Error deleting box', e);
    }
};

export const updateBox = async (id: string, updates: Partial<Box>): Promise<void> => {
    try {
        const docRef = doc(db, 'boxes', id);
        await updateDoc(docRef, updates);
    } catch (e) {
        console.error('Error updating box', e);
    }
};
