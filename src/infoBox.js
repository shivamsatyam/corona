import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./infoBox.css";


function InfoBox ({title,cases,total,active,isRed,...props}) {
	return(
		<Card className={`InfoBox ${active && "InfoBox--selected"} 
		${isRed && "InfoBox--red"}`}>
			<CardContent>
				<Typography color="textSecondary" gutterBottom>
					{title}
				</Typography>
				 <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
  <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
			</CardContent>
		</Card>
		)
}


export default InfoBox
