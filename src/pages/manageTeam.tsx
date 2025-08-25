import React from 'react';
import "../Styles/manageTeam.css";
import CoachSideBar from './components/sidebar/CoachSideBar';
import MainManage from './components/mainManage/mainManage';
function ManageTeam() {
// Get the navigate function
  return (
    <>
        <section className='ManageTeam'>
            <section className='glassyBack'>
                <CoachSideBar />
                <MainManage />
                <section className='sidebar'></section>
            </section>
        </section>
    </>
  );
}

export default ManageTeam;