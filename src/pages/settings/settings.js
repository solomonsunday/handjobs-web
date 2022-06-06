import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import './settings.css';
import NotificationSettings from 'pages/notification/settings';
import { useHistory } from 'react-router-dom';

export default function Settings() {

    const history = useHistory();
    const goToPreviousPath = () => {
        history.goBack()
    }

    return <>
        <div className="p-col-11 p-mt-2 p-mx-auto">
            <div className="p-card p-m-5" style={{ borderRadius: "1rem" }}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="settings-cardtitle h6">
                            <i className="pi pi-cog p-pr-2" />
                            Settings
                        </span>
                        <span className="p-pr-5" style={{ cursor: "pointer" }} onClick={goToPreviousPath}>
                            <i className="pi pi-arrow-left" />
                        </span>
                    </div>
                    <Accordion className="accordion-custom" activeIndex={0}>
                        <AccordionTab header={<span><i className="pi pi-bell p-mr-1"></i>Notification</span>}>
                            <NotificationSettings />
                        </AccordionTab>
                        {/* <AccordionTab header={<React.Fragment><i className="pi pi-user"></i><span>Header II</span></React.Fragment>}>
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                                voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><i className="pi pi-search"></i><span>Header III</span><i className="pi pi-cog"></i></React.Fragment>}>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                                cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>
                        </AccordionTab> */}
                    </Accordion>
                </div>
            </div>
        </div>
    </>
}
