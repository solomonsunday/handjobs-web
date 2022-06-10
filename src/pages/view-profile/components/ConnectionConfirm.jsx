import React from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import Spinner from '../../../components/spinner/spinner.component'
import { useSelector, useDispatch } from 'react-redux'

import { acceptRequest, rejectRequest } from "../../../store/modules/contact";
import { confirmDialog } from 'primereact/confirmdialog';

const ConnectionConfirm = ({ contactId, contactDetails, title, application}) => {
  const loading = useSelector(state => state.contact.loadingContact);
  const dispatch = useDispatch()

  const handleAcceptRequest = (e) => {


    //since backend is not giving details of contact in response at accept
    dispatch(acceptRequest({ contactId: contactId }, "acceptConnectionRequest", contactDetails))
  }

  const confirmRequestRejection = (e) => {
    confirmDialog({
      message: 'Are you sure you want to reject this connection request?',
      header: 'Reject Connection Request',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        dispatch(rejectRequest(contactId, "rejectRequest"));
      }
    });
  };

  return (
    <div className="p-2"  >
      <Card >
        <div className="pd-flex p-flex-column">
          <p>{title}</p>
          {loading ? <Spinner /> : <div className="d-flex p-jc-center p-ai-center ">
            {application === "connection request" &&
            <>
             <Button loading={loading === "acceptConnectionRequest"} label="Accept" icon="pi pi-check" className='rounded-pill' onClick={handleAcceptRequest} />
            <Button loading={loading === "rejectRequest"} label="Reject" icon="pi pi-times" className="p-button-danger ml-2 rounded-pill" onClick={confirmRequestRejection} />
            </>}
            {application === "send request" &&
            <>
             <Button loading={loading === "acceptConnectionRequest"} label="Send Request" className="rounded-pill on-hover" onClick={handleAcceptRequest} />
            </>}
            {application === "accept applicant" &&
            <>
             <Button loading={loading === "acceptConnectionRequest"} label="Accept" icon="pi pi-check" className='rounded-pill' onClick={handleAcceptRequest} />
            <Button loading={loading === "rejectRequest"} label="Reject" icon="pi pi-times" className="p-button-danger ml-2 rounded-pill" onClick={confirmRequestRejection} />
            </>}
          </div>}
        </div>
      </Card>
    </div>
  )
}

export default ConnectionConfirm
