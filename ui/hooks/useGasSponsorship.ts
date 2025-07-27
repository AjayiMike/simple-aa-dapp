import { useLocalStorage } from "./useLocalStorage";

const useGasSponsorship = () => {
    const [gasSponsorship, setGasSponsorship] = useLocalStorage(
        "gasSponsorship",
        true
    );

    const toggleGasSponsorship = () => {
        setGasSponsorship(Boolean(!gasSponsorship));
    };

    return { gasSponsorship, toggleGasSponsorship };
};

export default useGasSponsorship;
