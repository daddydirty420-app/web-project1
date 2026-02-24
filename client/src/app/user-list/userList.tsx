"use client"

import Image from "next/image";
import { User } from "./type";
import styles from "./userList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStore, faTag } from "@fortawesome/free-solid-svg-icons";
import { FollowButton } from "@/components";
import Link from "next/link";

type Props = {
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    userList: User[];
    page: "follow" | "good-item" | "good-comment";
    followTab?: "follow" | "follower" | null;
    myFollow?: boolean;
};

export const UserList = ({ loggedIn, id, currentUserId, userList, page, followTab, myFollow }: Props) => {

    const followRemove = async (userId: string) => {};

    const search = async () => {};

    return (
        <>
        <section className={styles.searchSection}></section>

        <section className={styles.userListSection}>
            {userList.map((user) => (
                <section key={user.id} className={styles.userSection}>
                    <Link
                    href={`/profile/${user.id}`}
                    className={styles.userImageNameFlex}
                    >
                        <Image
                        src={user.profile_image ?? "/default-profile.png"}
                        alt="プロフィール画像"
                        width={45}
                        height={45}
                        className={styles.image}
                        />

                        <div className={styles.nameBlock}>
                            <p className={styles.userName}>{user.user_name}</p>

                            <div className={styles.iconRow}>
                                {user.honnin_verified && (
                                    <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                                )}
                                {user.early_seller && (
                                    <FontAwesomeIcon icon={faTag} className={styles.earlyIcon} />
                                )}
                                {user.ShopInfo && (
                                    <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />
                                )}
                            </div>
                        </div>
                    </Link>

                    {loggedIn && !(followTab === "follow" && myFollow) && (
                        <FollowButton targetUserId={user.id} currentUserId={currentUserId} />
                    )}

                    {loggedIn && followTab === "follow" && myFollow && (
                        <button
                        type="button"
                        className={styles.followRemoveButton}
                        onClick={() => followRemove(user.id)}
                        >
                            削除
                        </button>
                    )}
                </section>
            ))}
        </section>
        </>
    );
};