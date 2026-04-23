import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ListFlowArrow = () => {
    return (
        <li className="block ml-[120px] my-2">
            <FontAwesomeIcon icon={faArrowDown} className="text-(--theme) text-base" />
        </li>
    );
};
