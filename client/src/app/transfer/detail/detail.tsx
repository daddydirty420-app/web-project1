"use client";

import { formatDate } from "../../../lib/dayjs";
import { getAccountTypeLabel } from "../../../lib/getAccountTypeLabel";
import { Transfer } from "../types";
import styles from "./styles.module.css";

type Props = {
    transfer: Transfer;
};

export const TransferDetail = ({ transfer }: Props) => {
    const finish = transfer.trans_finish;
    const bank = transfer.bank_snapshot;

    const transDate = finish ? transfer.trans_at : transfer.trans_schedule_date;

    return (
        <>
            <section className={styles.transferSection}>
                <div className={styles.columnDiv}>
                    <div className={styles.moneyDiv}>
                        <p className={styles.title}>振込額</p>

                        <p className={styles.transMoney}>￥{transfer.trans_money.toLocaleString()}</p>

                        <div className={styles.transMoneySubFlex}>
                            <div className={styles.transMoneySub1ColumnFlex}>
                                <small className={styles.smallTitle}>振込申請額</small>

                                <small className={styles.smallMoney}>￥{transfer.request_money.toLocaleString()}</small>
                            </div>

                            <div className={styles.transMoneySub1ColumnFlex}>
                                <small className={styles.smallTitle}>振込手数料</small>

                                <small className={styles.smallMoney}>
                                    ￥{transfer.handling_charge.toLocaleString()}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.columnDiv}>
                    <div className={styles.dateDiv}>
                        <div className={styles.transDateDiv}>
                            <p className={styles.transDateTitle}>{finish ? "振込日" : "振込予定日"}</p>

                            <p className={styles.transDate}>{formatDate({ date: transDate, japanese: true })}</p>
                        </div>

                        <div className={styles.requestDateDiv}>
                            <p className={styles.requestTitle}>振込申請日</p>

                            <p className={styles.requestDate}>
                                {formatDate({ date: transfer.createdAt, japanese: true })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.columnDiv}>
                    <div className={styles.idDiv}>
                        <p className={styles.idTitle}>振込申請ID</p>

                        <p className={styles.id}>{transfer.transfer_id}</p>
                    </div>
                </div>

                <div className={styles.columnDiv}>
                    <section className={styles.bankAria}>
                        <p className={styles.bankTitle}>振込先口座</p>

                        <div className={styles.bankSnapshotDiv}>
                            <div className={styles.bankTextFlex}>
                                <p className={styles.bankText}>{bank.bank_name}</p>

                                <p className={styles.bankText}>{bank.branch_name}</p>
                            </div>

                            <div className={styles.bankTextFlex}>
                                <p className={styles.bankText}>
                                    {getAccountTypeLabel({ accountType: bank.account_type })}
                                </p>

                                <p className={styles.bankText}>{bank.account_number}</p>
                            </div>

                            <div className={styles.bankTextFlex}>
                                <p className={styles.bankText}>{bank.meigi}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
};
