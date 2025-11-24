import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function ListFlowArrow() {
    return (
        <li className="block ml-[120px] my-2">
            <FontAwesomeIcon icon={faArrowDown} className='text-(--theme) text-base' />
        </li>
    );
}