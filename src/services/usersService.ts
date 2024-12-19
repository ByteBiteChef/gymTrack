import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
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


export const fetchDailyCalories = async (currentUser: string) => {
    if (!currentUser) {
        console.error("No current user specified.");
        return [];
    }

    try {
        const userDocRef = doc(db, "dailyCalories", currentUser);

        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error("No dailyCalories data found for the user.");
            return [];
        }

        const userData = userDoc.data();
        const { dates = [] } = userData; 
        const entries = dates.map((timestamp: string) => ({
            timestamp,
            ...userData[timestamp], 
        }));

        console.log("Daily Calories Data:", entries);
        return entries;
    } catch (error) {
        console.error("Error fetching dailyCalories:", error);
        return [];
    }
};
