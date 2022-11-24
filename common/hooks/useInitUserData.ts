import { getMeProfile } from "@/common/api/user";
import { AuthContext, AuthContextState } from "@/common/hooks/useAuth";
import { useContext } from "react";

export default function useInitUserData () {
    const { dispatch } = useContext(AuthContext);
    
    const initUserData = async() => {
        try {
            const { data } = (await getMeProfile()).data;
            dispatch({
              type: "setInitialState",
              data: {
                isAuthenticated: true,
                isInitial: true,
                user: data.display_name,
                profile: {
                  avatar: data.avatar,
                  display_name: data.display_name,
                  id: data._id,
                  role: data.role,
                  wallet_id: data.wallet_id
                },
              } as AuthContextState,
            });
          } catch (error) {
            console.log(error);
          }
    }
    return initUserData;
}
