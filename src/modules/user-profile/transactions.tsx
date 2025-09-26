import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Spinner, Table, UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";

import { useAppSelector } from "@/app/config/store";
import "./user-profile.scss";

interface TxRow {
  id?: number;
  orderId?: string;
  txnRefId?: string;
  date?: string;
  type?: string;
  method?: string;
  amount?: number | string;
  status?: string;
  balance?: number | string;
}

const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString() : "";

const fmtAmount = (a?: number | string) => {
  if (a === null || a === undefined || a === "") return "";
  const n = typeof a === "string" ? Number(a) : a;
  if (Number.isNaN(n)) return String(a);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const classForStatus = (s?: string) => String(s || "").toLowerCase();

// Utility function to truncate long text
const truncateText = (text: string, maxLength: number = 12) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Copy to clipboard function
const copyToClipboard = async (text: string, label: string = "Text") => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, {
      position: "top-right",
      autoClose: 2000,
    });
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy to clipboard");
  }
};

const Transactions: React.FC = () => {
  const account = useAppSelector((state) => state.authentication.account);
  const token = useMemo(() => localStorage.getItem("auth-token") || "", []);

  const [rows, setRows] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!account?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr("");

      try {
        const uxResp = await axios.get(`/api/user-extras/user/${account.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const userExtra = uxResp.data;
        const userExtraId = userExtra?.id;

        if (!userExtraId) {
          if (mounted) {
            setRows([]);
            setErr("User profile not found.");
          }
          return;
        }

        const txResp = await axios.get(
          `/api/transactions/by-user-extra/${userExtraId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const list: TxRow[] = Array.isArray(txResp.data) ? txResp.data : [];

        if (mounted) setRows(list);
      } catch (e: any) {
        if (mounted) {
          setErr(e?.response?.data || "Failed to load transactions.");
          setRows([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [account?.id, token]);

  const mobileList = (
    <section className="transactions-list d-lg-none d-flex flex-column gap-5">
      {loading ? (
        <div className="p-3">Loading…</div>
      ) : err ? (
        <div className="p-3 text-danger">{err}</div>
      ) : rows.length === 0 ? (
        <div className="p-3">No transactions yet.</div>
      ) : (
        rows.map((tx, index) => (
          <div
            key={`${tx.id ?? tx.orderId ?? Math.random()}`}
            className="transactions-list__item d-flex flex-column gap-3"
          >
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Order ID</h2>
              <div className="mobile-truncate-cell">
                {tx.orderId ? (
                  <>
                    <span
                      id={`mobile-order-${index}`}
                      className="truncated-text-mobile"
                      onClick={() =>
                        copyToClipboard(tx.orderId || "", "Order ID")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      {truncateText(tx.orderId, 16)}
                    </span>
                    <UncontrolledTooltip
                      placement="left"
                      target={`mobile-order-${index}`}
                    >
                      {tx.orderId} (Tap to copy)
                    </UncontrolledTooltip>
                  </>
                ) : (
                  <span>–</span>
                )}
              </div>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Gateway Ref</h2>
              <div className="mobile-truncate-cell">
                {tx.txnRefId ? (
                  <>
                    <span
                      id={`mobile-gateway-${index}`}
                      className="truncated-text-mobile"
                      onClick={() =>
                        copyToClipboard(tx.txnRefId || "", "Gateway Ref")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      {truncateText(tx.txnRefId, 16)}
                    </span>
                    <UncontrolledTooltip
                      placement="left"
                      target={`mobile-gateway-${index}`}
                    >
                      {tx.txnRefId} (Tap to copy)
                    </UncontrolledTooltip>
                  </>
                ) : (
                  <span>–</span>
                )}
              </div>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Date and Time</h2>
              <p>{fmtDateTime(tx.date)}</p>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Type</h2>
              <p>{tx.type || "-"}</p>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Method</h2>
              <p>{tx.method || tx.type || "-"}</p>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Amount</h2>
              <p>{fmtAmount(tx.amount)}</p>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Status</h2>
              <p>
                <span className={classForStatus(tx.status)}>{tx.status}</span>
              </p>
            </div>
            <div className="item__row d-flex justify-content-between align-items-center gap-2">
              <h2>Balance</h2>
              <p>{tx.balance ?? ""}</p>
            </div>
          </div>
        ))
      )}
    </section>
  );

  const desktopTable = (
    <Table className="transactions-table d-none d-lg-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Gateway Ref</th>
          <th>Date and Time</th>
          <th>Type</th>
          <th>Method</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="p-3">
              Loading…
            </td>
          </tr>
        ) : err ? (
          <tr>
            <td colSpan={8} className="p-3 text-danger">
              {err}
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={8} className="p-3">
              No transactions yet.
            </td>
          </tr>
        ) : (
          rows.map((tx, index) => (
            <tr key={`${tx.id ?? tx.orderId ?? Math.random()}`}>
              <td className="text-truncate-cell">
                {tx.orderId ? (
                  <>
                    <span
                      id={`order-${index}`}
                      className="truncated-text"
                      onClick={() =>
                        copyToClipboard(tx.orderId || "", "Order ID")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      {truncateText(tx.orderId, 12)}
                    </span>
                    <UncontrolledTooltip
                      placement="top"
                      target={`order-${index}`}
                    >
                      {tx.orderId} (Click to copy)
                    </UncontrolledTooltip>
                  </>
                ) : (
                  "–"
                )}
              </td>
              <td className="text-truncate-cell">
                {tx.txnRefId ? (
                  <>
                    <span
                      id={`gateway-${index}`}
                      className="truncated-text"
                      onClick={() =>
                        copyToClipboard(tx.txnRefId || "", "Gateway Ref")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      {truncateText(tx.txnRefId, 12)}
                    </span>
                    <UncontrolledTooltip
                      placement="top"
                      target={`gateway-${index}`}
                    >
                      {tx.txnRefId} (Click to copy)
                    </UncontrolledTooltip>
                  </>
                ) : (
                  "–"
                )}
              </td>
              <td>{fmtDateTime(tx.date)}</td>
              <td>{tx.type || "-"}</td>
              <td>{tx.method || tx.type || "-"}</td>
              <td>{fmtAmount(tx.amount)}</td>
              <td>
                <span className={classForStatus(tx.status)}>{tx.status}</span>
              </td>
              <td>{tx.balance ?? ""}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  if (loading) {
    return (
      <Spinner color="success" className="mx-auto">
        Loading...
      </Spinner>
    );
  }

  return (
    <article className="transactions d-flex flex-column gap-4">
      <h1 className="title d-lg-none">Transactions</h1>
      {mobileList}
      {desktopTable}
    </article>
  );
};

export default Transactions;
