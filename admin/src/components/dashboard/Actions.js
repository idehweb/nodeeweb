import * as React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import { Link } from "react-router-dom";
import { useGetList, useTranslate } from "react-admin";
import { subDays } from "date-fns";
import { dateFormat } from "@/functions";

import CardWithIcon from "./CardWithIcon";
import { Customer } from "@/functions/types";

const Actions = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const { title, direction = "rtl" } = props;
  const aMonthAgo = subDays(new Date(), 30);
  aMonthAgo.setDate(aMonthAgo.getDate() - 30);
  aMonthAgo.setHours(0);
  aMonthAgo.setMinutes(0);
  aMonthAgo.setSeconds(0);
  aMonthAgo.setMilliseconds(0);

  const { data: visitors } = useGetList(
    "action/myactions",
    {
      filter: {
        // has_ordered: true,
        // first_seen_gte: aMonthAgo.toISOString(),
      },
      sort: { field: "first_seen", order: "DESC" },
      pagination: { page: 1, perPage: 10 }
    });
  // console.log("visitors", visitors);

  // if (!loaded) return null;
  const nb = visitors ? visitors.reduce((nb) => ++nb, 0) : 0;
  // console.log("nb", nb);

  return (
    <CardWithIcon

      to="/action"
      icon={FormatListNumberedRtlIcon}
      title={title}
      subtitle={nb}
    >
      <List className={direction}>
        {visitors
          ? visitors.map((record) => (
            <ListItem
              button
              to={`/action/${record.id}/show`}
              component={Link}
              key={record.id}
            >
              <ListItemText
                primary={(record.title)}
              />
              {record.user && <ListItemText
                primary={(record.user.nickname)}
              />}
              {record.customer && <ListItemText
                primary={(record.customer.phoneNumber)}
              />}

              <ListItemText
                primary={dateFormat(record.createdAt)}
              />

            </ListItem>
          ))
          : null}
      </List>
      {/*<Box flexGrow="1">&nbsp;</Box>*/}
      {/*<Button*/}
      {/*className={classes.link}*/}
      {/*component={Link}*/}
      {/*to="/customer"*/}
      {/*size="small"*/}
      {/*color="primary"*/}
      {/*>*/}
      {/*<Box p={1} className={classes.linkContent}>*/}
      {/*{record.title}*/}
      {/*</Box>*/}
      {/*</Button>*/}
    </CardWithIcon>
  );
};

const useStyles = makeStyles(theme => ({
  link: {
    borderRadius: 0
  },
  linkContent: {
    color: theme.palette.primary.main
  }
}));

export default Actions;
