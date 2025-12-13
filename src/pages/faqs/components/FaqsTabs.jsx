import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./FaqsTabs.css";

const tabStyle = {
  color: "#0E0E0E",
  fontFamily: "Outfit",
  width: "645px",
  height: "45px",
  alignItems: "flex-start",
  border: "1px solid #B3B3B3",
  borderRadius: "15px",
  fontSize: "medium",
  fontWeight: "500",
  textTransform: "capitalize",
  padding: "15px",
  marginBottom: "20px",
};
const accoHeadStyle = {
  color: "#0E0E0E",
  fontFamily: "Outfit",
  fontSize: "medium",
  fontWeight: "500",
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function FaqsTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="FAQs"
      >
        <Tab label="General Information" {...a11yProps(0)} sx={tabStyle} />
        <Tab label="Ordering & Shipping" {...a11yProps(1)} sx={tabStyle} />
        <Tab label="Payments & Discounts" {...a11yProps(2)} sx={tabStyle} />
        <Tab label="Account & Profile" {...a11yProps(3)} sx={tabStyle} />
        <Tab label="Returnes & Exchanges" {...a11yProps(4)} sx={tabStyle} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div>
          <Accordion sx={{marginBottom:'20px'}}>
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                border: "1px solid #B3B3B3",
                borderRadius: "15px",
                padding: "10px",
                height: "45px",
              }}
            >
              <Typography component="span" sx={accoHeadStyle}>
                How can I place an order?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "20px",
                marginTop: "10px",
                border: "1px solid #205457",
                borderRadius: "10px",
                backgroundColor: "#205457",
                color: "white",
                fontSize: "medium",
                fontWeight: "500",
                fontFamily: "Outfit",
              }}
            >
              <Typography component="p">
                What payment methods do you accept?{" "}
                <RemoveIcon sx={{ float: "right" }} />
              </Typography>
              <Typography
                component="p"
                sx={{
                  marginTop: "10px",
                  color: "#A4A7AE",
                  fontWeight: "400",
                  fontStyle: "normal",
                  fontSize: "16px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                eiusmod
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{marginBottom:'20px'}}>
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                border: "1px solid #B3B3B3",
                borderRadius: "15px",
                padding: "10px",
                height: "45px",
              }}
            >
              <Typography component="span" sx={accoHeadStyle}>
                Can I track my order after it's been placed?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "20px",
                marginTop: "10px",
                border: "1px solid #205457",
                borderRadius: "10px",
                backgroundColor: "#205457",
                color: "white",
                fontSize: "medium",
                fontWeight: "500",
                fontFamily: "Outfit",
              }}
            >
              <Typography component="p">
                What payment methods do you accept?{" "}
                <RemoveIcon sx={{ float: "right" }} />
              </Typography>
              <Typography
                component="p"
                sx={{
                  marginTop: "10px",
                  color: "#A4A7AE",
                  fontWeight: "400",
                  fontStyle: "normal",
                  fontSize: "16px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                eiusmod
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{marginBottom:'20px'}}>
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                border: "1px solid #B3B3B3",
                borderRadius: "15px",
                padding: "10px",
                height: "45px",
              }}
            >
              <Typography component="span" sx={accoHeadStyle}>
                Do you offer customer support?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "20px",
                marginTop: "10px",
                border: "1px solid #205457",
                borderRadius: "10px",
                backgroundColor: "#205457",
                color: "white",
                fontSize: "medium",
                fontWeight: "500",
                fontFamily: "Outfit",
              }}
            >
              <Typography component="p">
                What payment methods do you accept?{" "}
                <RemoveIcon sx={{ float: "right" }} />
              </Typography>
              <Typography
                component="p"
                sx={{
                  marginTop: "10px",
                  color: "#A4A7AE",
                  fontWeight: "400",
                  fontStyle: "normal",
                  fontSize: "16px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                eiusmod
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{marginBottom:'20px'}}>
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                border: "1px solid #B3B3B3",
                borderRadius: "15px",
                padding: "10px",
                height: "45px",
              }}
            >
              <Typography component="span" sx={accoHeadStyle}>
                What is your return policy?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "20px",
                marginTop: "10px",
                border: "1px solid #205457",
                borderRadius: "10px",
                backgroundColor: "#205457",
                color: "white",
                fontSize: "medium",
                fontWeight: "500",
                fontFamily: "Outfit",
              }}
            >
              <Typography component="p">
                What payment methods do you accept?{" "}
                <RemoveIcon sx={{ float: "right" }} />
              </Typography>
              <Typography
                component="p"
                sx={{
                  marginTop: "10px",
                  color: "#A4A7AE",
                  fontWeight: "400",
                  fontStyle: "normal",
                  fontSize: "16px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                eiusmod
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{marginBottom:'20px'}}>
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                border: "1px solid #B3B3B3",
                borderRadius: "15px",
                padding: "10px",
                height: "45px",
              }}
            >
              <Typography component="span" sx={accoHeadStyle}>
                How to Create Account?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "20px",
                marginTop: "10px",
                border: "1px solid #205457",
                borderRadius: "10px",
                backgroundColor: "#205457",
                color: "white",
                fontSize: "medium",
                fontWeight: "500",
                fontFamily: "Outfit",
              }}
            >
              <Typography component="p">
                What payment methods do you accept?{" "}
                <RemoveIcon sx={{ float: "right" }} />
              </Typography>
              <Typography
                component="p"
                sx={{
                  marginTop: "10px",
                  color: "#A4A7AE",
                  fontWeight: "400",
                  fontStyle: "normal",
                  fontSize: "16px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                eiusmod
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
    </Box>
  );
}
