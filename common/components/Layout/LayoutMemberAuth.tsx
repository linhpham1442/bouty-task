import { useEffect, useState } from "react";
// import { useMoralis } from "react-moralis";
// import { useRouter } from "next/router";
// import { Loader } from "@mantine/core";
// import { useCheckMember } from "@/common/hooks/useCheckMember";
// import JoinClubModal, { ButtonAction } from "@/modules/ClubDetail/JoinClubModal";
// import { useDidMount } from "beautiful-react-hooks";
// import SwitchNetworkModal from "@/common/components/SwitchNetworkModal";
// import { Alert } from "@mantine/core";
// import { useAppSelector } from "@/common/redux/hooks";
// import { selectValue } from "@/common/redux/utils";
// import types from "@/common/redux/types";
// import { useAuth } from "@/common/hooks/useAuth";
// import ConnectWalletModal from "../ConnectWalletModal";

// let subcribeChainChanged = null as any;

// interface LayoutMemberAuthProps {
//   children: React.ReactElement;
//   isMemberRequired?: boolean;
// }
// const LayoutMemberAuth = ({ children, isMemberRequired = false }: LayoutMemberAuthProps) => {
//   const { Moralis, isWeb3Enabled } = useMoralis();
//   const { user: userAddress, isAuthenticated, isInitial } = useAuth();
//   const router = useRouter();
//   const { chain_id } = router.query;
//   // const userAddress = user?.attributes?.accounts?.[0];
//   const [openDialogSwitch, setOpenDialogSwitch] = useState(false);
//   const { loading, isMember } = useCheckMember(userAddress, true);
//   const [openDialog, setOpenDialog] = useState(false);

//   useEffect(() => {
//     if (isWeb3Enabled) {
//       if (Moralis.getChainId() && chain_id) {
//         if (parseInt(Moralis.getChainId()) !== parseInt(chain_id.toString())) {
//           setOpenDialogSwitch(true);
//         } else {
//           setOpenDialogSwitch(false);
//         }
//       }
//     }
//   }, [isWeb3Enabled, Moralis, chain_id]);

//   useDidMount(() => {
//     subcribeChainChanged = Moralis.onChainChanged((chainId: string) => {
//       if (parseInt(chainId) !== parseInt(chain_id.toString())) {
//         setOpenDialogSwitch(true);
//       } else {
//         setOpenDialogSwitch(false);
//       }
//     });
//   });

//   useEffect(() => {
//     return () => {
//       if (subcribeChainChanged) {
//         subcribeChainChanged();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!isAuthenticated && isInitial) {
//       setOpenDialog(true);
//     }
//   }, [isAuthenticated, isInitial]);

//   return (
//     <>
//       {loading ? (
//         <div className="relative flex items-center justify-center h-screen">
//           <Loader className="z-[9999] relative" size="xl" />
//         </div>
//       ) : !isMember && (squadDetail?.is_private === true || isMemberRequired) ? (
//         <JoinClubModal />
//       ) : (
//         <>
//           {!isMember ? (
//             <Alert color="yellow">
//               <div className="flex items-center justify-center mx-auto text-center sm:w-full sm:max-w-6xl">
//                 <span className="mr-2">Please join the squad so you can use the great features</span>
//                 <ButtonAction size="xs" color="yellow" fullWidth={false} />
//               </div>
//             </Alert>
//           ) : null}

//           {children}
//         </>
//       )}
//       <ConnectWalletModal isOpen={openDialog} onClose={() => setOpenDialog(false)} closeOnClickOutside={false} />
//       <SwitchNetworkModal isOpen={openDialogSwitch} onClose={() => setOpenDialogSwitch(false)} />
//     </>
//   );
// };

// export default LayoutMemberAuth;
