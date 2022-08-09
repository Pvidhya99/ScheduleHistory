import React from 'react';
import Section from '../components/common/Section';
import { Card, CardBody, Col, Row, Media } from 'reactstrap';
import PageHeader from '../components/common/PageHeader';
import Logo from '../components/navbar/Logo';
import Footer from '../components/footer/Footer';
const PrivacyPolicy=()=>{
return(
<Section className="py-0">
    <Row className="flex-center min-vh-100 py-6">
        <Col sm={12} md={12} lg={12} xl={12} className="col-xxl-12">
            <Logo />
            <Card>
                <CardBody className="fs--1 font-weight-normal p-5">
                    <PageHeader
                        title="PRIVACY POLICY"
                        description="<h5>MEALMANAGE POS APP.</h5><strong>Last updated April 9, 2021</strong>"
                        className="mb-3" />
                    <Card className="mb-3">
                        <CardBody>
                            <Media body className="ml-3">
                                <p><b>MEALMANAGE</b> (“we” or “us” or “our”) respects the privacy of our users (“user” or “you”). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application (the “Application”).   Please read this Privacy Policy carefully.  IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, PLEASE DO NOT ACCESS THE APPLICATION.</p>
                                <p>We reserve the right to make changes to this Privacy Policy at any time and for any reason.  We will alert you about any changes by updating the “Last updated” date of this Privacy Policy.  You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Application after the date such revised Privacy Policy is posted.</p>
                                <p>This Privacy Policy does not apply to the third-party online/mobile store from which you install the Application or make payments, including any in-game virtual items, which may also collect and use data about you.  We are not responsible for any of the data collected by any such third party.</p>
                                <h4 className="alert-heading">COLLECTION OF YOUR INFORMATION</h4>
                                <p>We may collect information about you in a variety of ways.  The information we may collect via the Application depends on the content and materials you use, and includes: </p>
                                <h5>PERSONAL DATA</h5>
                            
                            </Media>
                        </CardBody>
                    </Card>
                </CardBody>
            </Card>
        </Col>
    </Row>
    <Footer />
</Section>);
}
export default PrivacyPolicy