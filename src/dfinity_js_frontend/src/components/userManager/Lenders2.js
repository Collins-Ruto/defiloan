import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Lender from "./Lender";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getLenders as getLenderList,
  createLender,
  updateLender,
  getLenderByOwner,
  followLender,
} from "../../utils/lenderManager";
import AddLender from "./AddLender";
import UpdateLender from "./UpdateLender";

const Lenders = () => {
  const [lenders, setLenders] = useState([]);
  const [lender, setLender] = useState({});
  const [loading, setLoading] = useState(false);

  // function to get the list of lenders
  const getLenders = useCallback(async () => {
    try {
      setLoading(true);
      setLenders(await getLenderList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });
  [];

  // function to get the list of lenders
  const getLenderOwner = useCallback(async () => {
    try {
      setLoading(true);
      getLenderByOwner().then((resp) => {
        console.log(resp);
        setLender(resp.Ok);
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addLender = async (data) => {
    try {
      setLoading(true);
      data.interestRate = parseInt(data.interestRate, 10);
      createLender(data).then((resp) => {
        getLenders();
        getLenderOwner();
      });
      toast(<NotificationSuccess text="Lender added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a lender." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      updateLender(data).then((resp) => {
        getLenders();
      });
      toast(<NotificationSuccess text="Lender added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a lender." />);
    } finally {
      setLoading(false);
    }
  };

  const follow = async (data) => {
    try {
      setLoading(true);
      followLender(data).then((resp) => {
        getLenders();
      });
      toast(
        <NotificationSuccess text="Lender added to followers successfully." />
      );
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to follow lender." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLenders();
    getLenderOwner();
  }, []);

  console.log(lender);

  return (
    <div className="d-flex justify-content-center">
      {!loading ? (
        !lender?.name ? (
          <AddLender save={addLender} />
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">Lenders</h1>
              <UpdateLender lender={lender} save={update} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {lenders.map((_lender, index) => (
                <Lender
                  key={index}
                  lender={{
                    ..._lender,
                  }}
                  follow={follow}
                />
              ))}
            </Row>
          </div>
        )
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Lenders;
