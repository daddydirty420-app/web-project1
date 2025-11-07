import { Container, Header, Footer, Back } from "@/components";
import { Item } from "./itemPageTypes";
import { Items } from "@/types/itemListTypes";
import Main from "./main";
import SellerSectionBottom from "./sellerSection/sellerSectionBottom";
import ItemListSection from "./itemListSection";
import CommentSection from "./commentSection/commentSection";
import Link from "next/link";
import styles from "./itemCommon.module.css";
import { Session } from "next-auth";
import EditButton from "./draft/editButton";
import DeleteButton from "./madmax/deleteButton";
import Title from "./confirm/title";
import UploadButton from "./confirm/uploadButton";
import DeleteItem from "./sellerSection/deleteItem";
import Restore from "./deleted/restore";
import PerfectDelete from "./deleted/perfectDelete";

type Props = {
    id: string;
    item: Item;
    itemList?: Items[];
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    session: Session | null;
    commentCount?: number;
    goodCount?: number;
    isGood?: boolean;
    reportCount?: number;
};

export default function ItemPage({ id, item, itemList, sellerMe, page, session, commentCount, goodCount, isGood, reportCount }: Props) {
    if (!["normal", "admin", "draft", "confirm", "deleted"].includes(page)) {
        console.error("ページ信号が正しくありません。page：", page);
        return;
    }

    let buttonLink = "";
    let buttonText = "";
    if (page === "normal") {
        buttonLink = `/money-management/item/${id}`;
        buttonText = "売上管理";
    } else if (page === "admin") {
        buttonLink = `/madmax/fileEdit/${id}`;
        buttonText = "ファイル編集";
    }
    
    return (
        <>
        {page === "normal" && <Header />}

        <Container header={page === "normal"}>
            {page === "deleted" && <Restore id={id} item={item} session={session} />}
            {page === "confirm" && <Title />}
            {page === "draft" && <EditButton id={id} />}
            {page === "admin" && <DeleteButton id={id} item={item} session={session} />}
            {["normal", "admin", "draft"].includes(page) && <Back />}

            <Main id={id} item={item} sellerMe={sellerMe} page={page} session={session} goodCount={goodCount} isGood={isGood} reportCount={reportCount} />
            {["normal", "admin"].includes(page) && (
                <>
                {page === "normal" && <ItemListSection itemList={itemList} sellerMe={sellerMe} />}
                {(page === "admin" || sellerMe) && <Link href={buttonLink} className={styles.uriageButton}>{buttonText}</Link>}

                <CommentSection id={id} sellerMe={sellerMe} session={session} commentCount={commentCount} page={page as "normal" | "admin"} />
                {sellerMe && page === "normal" && <SellerSectionBottom id={id} item={item} session={session} />}
                </>
            )}
                
            {page === "draft" && (
                <>
                <EditButton id={id} />
                <DeleteItem id={id} session={session} />
                </>
            )}
            {page === "confirm" && <UploadButton id={id} session={session} />}
            {page === "deleted" && (
                <>
                <Restore id={id} item={item} session={session} />
                <PerfectDelete id={id} session={session} />
                </>
            )}
        </Container>

        {page === "normal" && <Footer />}
        </>
    );
};