import React, { useState, useEffect, useReducer, useRef } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'

import useProjectsAndStatus from '../hooks/Project_Status'

const PROJECTS_QUERY = gql`
  query PROJECTS_QUERY {
    projects
  }
`

const STATUS_QUERY = gql`
  query STATUS_QUERY {
    status
  }
`;

const UPDATEGDB_MUTATION = gql`
mutation updateGdb(
  $_id: String!
  $project: String,
  $rfaid: String,
  $description: String,
  $status: String,
  $created: Date,
  $updated: Date,
  $notes: [NoteInput]) {
  updateGdb(
    _id: $_id,
    project: $project,
    rfaid: $rfaid,
    description: $description,
    created: $created,
    updated: $updated,
    status: $status,
    notes: $notes
    ){
      _id
    }
}`

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
`

const Container = styled.div`
  height: 90vh;
`

const formStyle = {
  paddingRight: '4px',
  maxHeight: 'calc(100vh - 115px)',
  display: 'grid',
  gridTemplateRows: 'repeat(5, minmax(75px, auto))'
}

const firstRow = {
  display: 'grid',
  gridTemplateRows: 'auto auto',
  gridTemplateColumns: 'auto 1fr auto'
}

const firstRowGrid = {
  display: 'grid',
  gridTemplateRows: 'auto auto'
};

const newStatus = {
  alignSelf: 'end',
  paddingLeft: '4px',
  paddingRight: '4px'
};

const showNew = {
  display: 'inline-block',
  border: 'none',
  height: '2rem',
  borderRadius: '4px',
  background: '#D4EDF2',
  color: '#fe6b21',
  fontFamily: 'Nunito',
  paddingLeft: '4px'
}

const hideNew = {
  display: 'none'
}

const showNote = {
  display: 'inline-block',
  marginBottom: 4+'px'
};

const hideNote = {
  display: 'none'
}

const Gdb = (props) => {
  const init = (initialValues) => {
    return props.location.state.gdb.notes;
  }

  const notesReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_NOTE': 
        console.log(state);

        const newNote = {
          created: moment(),
          note: action.note
        }
        console.log(newNote)

        return [...state, newNote];
        break;
      case 'DELETE_NOTE':
        console.log(`delete note`);
        return state;
      default:
        throw new Error();
    }
  }
  const newNoteRef = useRef(null);
  const [toggleNewStatus, setToggleNewStatus] = useState(false);
  const [disableStatus, setDisableStatus] = useState(false);
  const [project, setProject] = useState('');
  const [created, setCreated] = useState('');
  const [updated, setUpdated] = useState('');
  const [status, setStatus] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [rfaid, setRfaid] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState({});
  const [showNewNote, setShowNewNote] = useState(false);
  const initialState = [{created: moment(), note: 'teste'}]
  const [notes, dispatch] = useReducer(notesReducer, initialState, init);
  const [idx, setIdx] = useState(0);

  let history = useHistory();

  const [updateGdb, { data: mutationData }] = useMutation(UPDATEGDB_MUTATION)

  const { gdb } = props.location.state;

  useEffect(() => {
    const { gdb } = props.location.state;

    setProject(gdb.project);
    setCreated(gdb.created);
    setRfaid(gdb.rfaid);
    setUpdated(moment());
    setDescription(gdb.description);
    setStatus(gdb.status);
  }, [props.location.state]);

  const showHideNewStatus = () => {
    setToggleNewStatus(!toggleNewStatus);
    setDisableStatus(!disableStatus);
  }

  const handleProject = e => {
    setProject(e.target.value);
  }

  const handleCreated = date => {
    setCreated(date);
  }

  const handleUpdated = date => {
    setUpdated(date);
  }

  const handleStatus = e => {
    setStatus(e.target.value);
  }

  const handleNewStatus = e => {
    setNewStatus(e.target.value);
  }

  const handleRfaid = e => {
    setRfaid(e.target.value);
  }

  const handleDescription = e => {
    setDescription(e.target.value)
  }

  const handleNewNote = e => {
    setShowNewNote(!showNewNote);
    if(!showNewNote) {
      // clean new note useReducer
    }
  }

  const handleSaveNewNote = e => {
    e.preventDefault();
    dispatch({type: 'ADD_NOTE', note: newNoteRef.current.value});
    newNoteRef.current.value = '';
    setShowNewNote(!showNewNote);
    setIdx(notes.length);
  }

  const handleCancelNewNote = e => {
    console.log('cancel note');
    e.preventDefault();
    // TODO: clean textArea
  }

  const handlePreviousNote = e => {
    if (idx !== 0) {
      setIdx(idx - 1);
    }
  }

  const handleNextNote = e => {
    if (idx !== (notes.length - 1)) {
      setIdx(idx + 1);
    }
  }

  const hasNext = () => {
    return idx !== (notes.length - 1);
  }

  const handleSubmit = e => {
    e.preventDefault();
    let updatedGdb = {};
    const { gdb } = props.location.state;

    updatedGdb._id = gdb._id;
    updatedGdb.project = project;
    updatedGdb.created = created;
    updatedGdb.updated = updated;
    updatedGdb.rfaid = rfaid;
    updatedGdb.status = (newStatus && newStatus !== '') ? newStatus : status;
    updatedGdb.description = description;
    if (notes.length > 0) {
      updatedGdb.notes = notes;
    }

    updateGdb({variables: updatedGdb});

    history.push('/');
  }

  const t = useProjectsAndStatus();

  if (t[0].loading || t[1].loading) return <p>...loading...</p>
  if (t[0].error || t[1].error) return <p>...error...</p>

  if ((t[0].data && t[0].data.projects) && (t[1].data && t[1].data.status)){
    return (
      <Container>
        <Content>
          <form style={formStyle} onSubmit={handleSubmit}>
            <div style={firstRow}>
              <div style={firstRowGrid}>
              <span className='project-label'>Project</span>                  
              <select name='projectSelect'
                className='project-select'
                onChange={handleProject}
                >
                  {t[0].data.projects.map(p => {
                      if (p === props.location.state.gdb.project) {
                        return (
                          <option value={p} key={p} selected>
                            {p}
                          </option>
                        )
                      } else {
                        return (
                          <option value={p} key={p}>
                            {p}
                          </option>
                        )
                      }
                    })}
                </select>
              </div>
              <span></span>
              <div style={firstRowGrid}>
                <span className='date-label'>Created @</span>
                <DatePicker
                  className='date-input'
                  dateFormat='dd/MM/yyyy'
                  value={moment(created).format('DD/MM/YYYY')}
                  onChange={date => handleCreated(date)}
                />
              </div>
              <div style={firstRow}>
                <div style={firstRowGrid}>
                  <div>
                    <span className="rfaid-label">Status</span>
                    <span className='newGdb' onClick={showHideNewStatus}>
                      [+]
                    </span>
                  </div>
                  <select className="project-select" disabled={disableStatus} onChange={handleStatus}>
                  { t[1].data.status.map(s => {
                    if (s === props.location.state.gdb.status) {
                      return <option value={s} key={s} selected>{s}</option>
                    } else {
                      return <option value={s} key={s}>{s}</option>
                    }
                  })}
                  </select>
                </div>
              </div>
              <div style={firstRowGrid} className={toggleNewStatus ? 'showNewStatus' : 'hideNewStatus'}>
                <span className="rfaid-label">New Status</span>
                <input className='newStatus-input' autoComplete='off' onChange={handleNewStatus} />
              </div>
              <div style={firstRowGrid}>
                <span className='date-label'>Updated @</span>
                <DatePicker
                  className='date-input'
                  dateFormat='dd/MM/yyyy'
                  value={moment(updated).format('DD/MM/YYYY')}
                  onChange={date => handleUpdated(date)}
                />
              </div>
            </div>
            <div>
              <span className='rfaid-label'>RFA ID</span>
              <input id='rfaid'
                className='rfaid-input'
                autoComplete='off' 
                value={rfaid || gdb.rfaid}
                onChange={handleRfaid}
                />
            </div>
            <div className='description-container'>
              <span className='description-label'>Description</span>
              <input id='description'
                className='description-input'
                autoComplete='off'
                value={description || gdb.description}
                onChange={handleDescription}
                />
            </div>
            <div className='notes'>
              <span className='notesLabel'>Notes 
                <span className='newGdb' onClick={handleNewNote}>{showNewNote ? '[-]' : '[+]'}</span>
                <span className='badge'>{notes.length}</span>  
              </span>
              <div className='newNote--container' style={showNewNote ? showNote: hideNote}>
                <textarea className='notesTextarea' ref={newNoteRef} />
                <div className='newNote--buttons'>
                  <button className='newNote-cancel' onClick={handleCancelNewNote}>Cancel</button>
                  <button className='newNote-save' onClick={handleSaveNewNote}>Save</button>
                </div>
              </div>
              <div key={note.created} className='noteContainer'>
                <div className='note--container'>
                  <span className='previousNote'><FontAwesomeIcon icon={faAngleLeft} onClick={handlePreviousNote} className={(idx == 0) ? 'prev-next-icons-disabled':'prev-next-icons'} fixedWidth /></span>
                  <textarea id='notes' className='notesTextarea' value={notes[idx].note} key={notes[notes.length-1].created} readOnly/>
                  <span className='nextNote'><FontAwesomeIcon icon={faAngleRight} onClick={handleNextNote} className={ hasNext() ? 'prev-next-icons' : 'prev-next-icons-disabled'} fixedWidth /></span>
                </div>
                <div className='note--info'>
                  <span className='note--info--total'>{idx + 1} / {notes.length}</span>
                  <span className='note--info--created'>{moment(notes[idx].created).format('DD/MM/YYYY')}</span>
                </div>
              </div>
            </div>
            <button type='submit' className='btnSubmit'>
              Save
            </button>
          </form>
        </Content>
      </Container>
    )
  }
}

export default Gdb
