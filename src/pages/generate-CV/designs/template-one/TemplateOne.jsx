import moment from 'moment';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react';
import "./TemplateOne.css";

const SkillLevel = ({editMode}) => {
    const skills = [
        { label: 'Novice', value: 20 },
        { label: 'Amateur', value: 50 },
        { label: 'Professional', value: 75 },
        { label: 'Expert', value: 100 }
    ];
    const [selectedSkill, setSelectedSkill] = useState(0);

    return (<>
        {editMode && <Dropdown
            options={skills}
            value={selectedSkill}
            onChange={e => setSelectedSkill(e.value)}
            placeholder="Skill level" 
            className="form-control"
        />}
        <div style={{padding: '10px'}}></div>
        <div className="info-progress">
            <ProgressBar value={selectedSkill} />
        </div>
    </>)
}

const TemplateOne = ({ profileInfo, editMode, setEditMode }) => {
    console.log('profile info', profileInfo);

    return (
        <div className="template-container">
            <div className="p-grid">
                <div className="p-col-4">
                    <div className="sidebar-content">
                        <header>
                            <div className="header">
                                <h3>{profileInfo.firstName} {profileInfo.lastName}</h3>
                                <p className="heading-3">Sales Representative</p>
                            </div>
                        </header>
                        {/* Personal Info */}
                        <div className="section personal-info">
                            <header>Personal Info</header>
                            <div className="info">
                                <h4 className="info-title">Phone</h4>
                                <p className="info-text">{profileInfo?.phoneNumber}</p>
                            </div>
                            <div className="info">
                                <h4 className="info-title">Email</h4>
                                <p className="info-text">{profileInfo?.contactEmail}</p>
                            </div>
                            <div className="info">
                                <h4 className="info-title">LinkedIn</h4>
                                <p className="info-text">linkedIn.com/in/jillmorganzety</p>
                            </div>
                        </div>
                        {/* Skills */}
                        <div className="section skill">
                            <header>Skills {editMode ? <i className="pi pi-times" style={{color: 'white', fontSize: '16px'}} onClick={() => setEditMode(false)}></i> : <i className="pi pi-pencil" style={{color: 'white', fontSize: '16px'}} onClick={() => setEditMode(true)}></i>} </header>
                            {profileInfo?.skills.map((skill, i) => (<div key={i} className="info">
                                <h4 className="info-title">{skill}</h4>
                               <SkillLevel editMode={editMode} skill={skill} />
                            </div>))}

                        </div>
                        {/* Language */}
                        <div className="section language">
                            <header>Language</header>
                            <div className="info">
                                <h4 className="info-title">Spanish</h4>
                                <p className="info-progress">
                                    <ProgressBar value={45} />
                                </p>
                                <p className="info-small-right-text">C1 Certified</p>
                            </div>
                            <div className="info">
                                <h4 className="info-title">Italian</h4>
                                <p className="info-progress">
                                    <ProgressBar value={60} />
                                </p>
                                <p className="info-small-right-text">Basic</p>
                            </div>

                        </div>

                    </div>
                </div>
                <div className="p-col-8">
                    <div className="main-content">
                        <p className="bio">
                            {profileInfo.profile}
                        </p>

                        <div className="experience">
                            <hr />
                            <h4>Experience</h4>
                            <hr />
                            <div className="experience-list">
                                {profileInfo.experiences.map(experience => (<div key={experience.id} className="experience-item">
                                    <div className="experience-duration">
                                        <span>{moment(experience.startDate).format("YYYY-MM")}</span> - <span>{moment(experience.endDate).format("YYYY-MM")}</span>
                                    </div>
                                    <div className="experience-body">
                                        <h4>{experience.jobTitle}</h4>
                                        <p className="company">{experience.company}, {experience.location}</p>
                                        <ul>
                                            <li>Managed organizational sales and group of sales Representative</li>
                                            <li>Curabitur in efficitur ex, ac rutrum purus. Quisque pellentesque iaculis orci</li>
                                            <li>Proin vulputate varius est, ut dictum neque aliquet sit amet. Curabitur blandit nunc in</li>
                                            <li>Curabitur in efficitur ex, ac rutrum purus. Quisque pellentesque iaculis orci</li>
                                        </ul>
                                        <h4 className="key-achievement">Key Achievement</h4>
                                        <p className="achievement">Achieved over $500,000 in sales in each fiscal quarter from 2019.</p>
                                    </div>
                                </div>))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateOne