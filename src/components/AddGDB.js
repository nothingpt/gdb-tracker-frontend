import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import DatePicker from "react-datepicker";

const PROJECTS_QUERY = gql`
  query PROJECTS_QUERY {
    projects
  }
`;

const Content = styled.div`
  display: grid;
  max-width: 70vw;
  margin: 0 auto;
  height: 100%;
  /* max-height: calc(100vh - 200px); */
  grid-template-rows: 1fr;
  grid-gap: 4px;
  background: #52a3cc;
  border-radius: 16px;
  padding-left: 4px;
  padding-top: 12px;
`;

const Container = styled.div`
  height: calc(100vh - 100px);
`;

const formStyle = {
  paddingRight: "4px",
  maxHeight: "calc(100vh - 115px)",
  display: "grid",
  gridTemplateRows: "repeat(5, minmax(75px, auto))"
};

const firstRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr"
};

const dateDiv = {
  justifySelf: "end"
};

const showNew = {
  display: "inline-block",
  border: "none",
  height: "2rem",
  borderRadius: "4px",
  // width: "50%",
  background: "#D4EDF2",
  color: "#fe6b21",
  fontFamily: "Nunito",
  paddingLeft: "4px",
};

const hideNew = {
  display: "none"
};

const AddGDB = () => {
  const selectProject = useRef();
  const [project, setProject] = useState("");  
  const [rfaId, setRfaId] = useState("");
  const [created, setCreated] = useState(new Date());
  const [description, setDescription] = useState("");

  const [newProject, setNewProject] = useState(false);

  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(PROJECTS_QUERY);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(`project: ${project}`);
  };

  const handleNewProject = () => {
    setNewProject(!newProject);
  };

  const handleProject = (e) => {
    setProject(e.target.value);
  };

  if (loadingProjects) return <p> ... Loading ...</p>;
  if (errorProjects) return <p>An error occurred</p>;
  if (dataProjects && dataProjects.projects) {
    let options = [];    
    dataProjects.projects.forEach(p => {
      const o = {
        value: p,
        label: p
      };
      options.push(o);
    });
    return (
      <Container>
        <Content>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={firstRow}>
              <div>
                <div className="project-container">
                  <span className="project-label">Project</span>
                  <div>
                    <select name="projectSelect" className="project-select" onChange = {handleProject}>
                      <option defaultValue value="0">
                        --Select a Project
                      </option>
                      {dataProjects.projects.map(project => (
                        <option value={project} key={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                    <span onClick={handleNewProject} className="newGdb">
                      [+]
                    </span>
                    <input name="newProjectInput" style={newProject ? showNew : hideNew} onChange={handleProject} />
                  </div>
                </div>
              </div>
              <div className="date-container">
                <span className="date-label">Date</span>
                <DatePicker
                  className="date-input"
                  dateFormat="dd/MM/yyyy"
                  selected={created}
                  onChange={date => setCreated(date)}
                />
              </div>
            </div>
            <div>
              <span className="rfaid-label">RFA ID</span>
              <input id="rfaid" className="rfaid-input" />
            </div>
            <div className="description-container">
              <span className="description-label">Description</span>
              <input id="description" className="description-input" />
            </div>
            <div>
              <span className="notesLabel">Notes</span>
              <textarea id="notes" className="notesTextarea" />
            </div>
            <button type="submit" className="btnSubmit">
              Submit
            </button>
          </form>
        </Content>
      </Container>
    );
  }
};

export default AddGDB;
