import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";


/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchUsers = (setUsers: any) => {
	const usersRef = collection(db, "users");
	const unsubscribe = onSnapshot(usersRef, (snapshot) => {
		const userList = snapshot.docs.map((doc) => doc.id);
		setUsers(userList);
	});
	return () => unsubscribe();
};