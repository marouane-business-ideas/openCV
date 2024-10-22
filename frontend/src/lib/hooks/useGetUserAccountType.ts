import { useContext, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import useSWR from "swr";

import { ResumeDispatchContext } from "../../context/ResumeContext";
import fetcher from "../fetcher/fetcher";

const useGetUserAccountType = () => {
    const dispatch = useContext(ResumeDispatchContext);
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();


    const { data, isLoading, error } = useSWR(isSignedIn ?
        `/api/users/${user.id}/account-type` :
        null,
        async (url) => {
            const token = await getToken();
            return fetcher(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
        }
    );

    useEffect(() => {
        if (dispatch)
            dispatch({ type: "SET_ACCOUNT_TYPE", payload: { type: data?.userAccountType, isLoading, error } });
    }, [dispatch, data?.userAccountType, isLoading, error]);

};

export default useGetUserAccountType;