// react
import { useContext } from "react";

// contexts
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
	return useContext(AuthContext);
};
