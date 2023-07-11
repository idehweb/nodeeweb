import React from "react";


export default (props) => {
  return [
    {
      id: "-51",
      name: "UnsuccessfulPayment",
      color: "erro"

    },
    {
      id: "3",
      name: "CanceledByTheUser",
      color: "erro"

    },
    {
      id: "-12",
      name: "ExcessiveEffortInAShortPeriodOfTime",
      color: "erro"

    },
    {
      id: "-9",
      name: "ValidationError",
      color: "warn"

    },
    {
      id: "100",
      name: "SuccessfulOperation",
      color: "succ"
    },
    {
      id: "1",
      name: "PaidApproved",
      color: "succ"
    },
    {
      id: "2",
      name: "PaidNotApproved",
      color: "succ"
    },
    {
      id: "-2",
      name: "InternalError",
      color: "erro"
    },
    {
      id: "-1",
      name: "WaitingForPayment",
      color: "warn"
    }
  ];
};
