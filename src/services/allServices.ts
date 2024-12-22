import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { IFood } from "./types";
import { toast } from "sonner";


export const fetchUsers = (setUsers: (users: string[]) => void) => {
	const usersRef = collection(db, "users");
	const unsubscribe = onSnapshot(usersRef, (snapshot) => {
		const userList = snapshot.docs.map((doc) => doc.id);

        setUsers(userList);
	});
	return () => unsubscribe();
};


export const fetchDailyCalories = (
  currentUser: string,
  callback: (data: any[]) => void
) => {
  if (!currentUser) {
    console.error("No current user specified.");
    return () => {};
  }

  try {
    const userDocRef = doc(db, "dailyCalories", currentUser);

    // Real-time listener with onSnapshot
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Transform Firestore structure into the required format
        const allEntries = Object.entries(userData).flatMap(
          ([date, data]: [string, any]) => {
            if (data.entries && Array.isArray(data.entries)) {
              return data.entries.map((entry: any) => ({
                date,
                ...entry,
              }));
            }
            return [];
          }
        );

        callback(allEntries); // Pass transformed data to the callback
      } else {
        console.log("No dailyCalories data found.");
        callback([]); // Pass empty array if no data exists
      }
    });

    return unsubscribe; // Return unsubscribe function to stop the listener when no longer needed
  } catch (error) {
    console.error("Error subscribing to dailyCalories:", error);
    return () => {};
  }
};

const createFoodQuery = (user: string) => {
    if (!user) return null;

    const foodRef = collection(db, "food");
    return query(
        foodRef,
        where("__name__", ">=", `${user}%%`),
        where("__name__", "<", `${user}%%\uffff`)
    );
};

// Function to map snapshot data to the desired structure
/* eslint-disable @typescript-eslint/no-explicit-any */
const mapSnapshotToFoodList = (snapshot: any): IFood[] => {
    return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        caloriesPer100g: doc.data().caloriesPer100g,
    }));
};

// Main function to fetch food
export const fetchFood = (user: string, setFoodList: (foodList: IFood[]) => void) => {
    const foodQuery = createFoodQuery(user);
    if (!foodQuery) return;

    const unsubscribe = onSnapshot(foodQuery, (snapshot) => {
        const updatedFoodList = mapSnapshotToFoodList(snapshot);
        setFoodList(updatedFoodList);
    });

    return () => unsubscribe();
};