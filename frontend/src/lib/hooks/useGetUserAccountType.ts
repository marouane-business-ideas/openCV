import { useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import useSWR from "swr";

import { AccountType_Type, ResumeDispatchContext } from "../../context/ResumeContext";
import fetcher from "../fetcher/fetcher";

const useGetUserAccountType = () => {
    const dispatch = useContext(ResumeDispatchContext);
    const { user, isSignedIn } = useUser();

    const { data, isLoading, error } = useSWR<{ userAccountType: AccountType_Type }>(isSignedIn ?
        `http://localhost:1337/api/users/${user.id}/account-type` :
        null,
        fetcher
    );


    useEffect(() => {
        if (dispatch)
            dispatch({ type: "SET_ACCOUNT_TYPE", payload: { type: data?.userAccountType, isLoading, error } });
    }, [dispatch, data?.userAccountType, isLoading, error]);

};

export default useGetUserAccountType;