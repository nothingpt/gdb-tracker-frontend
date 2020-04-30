import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const PROJECTS_QUERY = gql`
  query PROJECTS_QUERY {
    projects
  }
`

const ADDGDB_MUTATION = gql`
mutation createGdb(
  $project: String!,
  $rfaid: String!,
  $description: String!,
  $status: String!,
  $created: Date,
  $notes: NoteInput) {
  createGdb(
    project: $project,
    rfaid: $rfaid,
    description: $description,
    created: $created,
    status: $status,
    notes: $notes
    ) {
    project
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
  height: calc(100vh - 100px);
`

const formStyle = {
  paddingRight: '4px',
  maxHeight: 'calc(100vh - 115px)',
  display: 'grid',
  gridTemplateRows: 'repeat(5, minmax(75px, auto))'
}

const firstRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr'
}

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

const AddGDB = () => {
  const [project, setProject] = useState('')
  const [nProject, setNProject] = useState('')
  const [newProject, setNewProject] = useState(false)
  const [created, setCreated] = useState(new Date())
  const [rfaId, setRfaId] = useState('')
  const [description, setDescription] = useState('')
  const [note, setNote] = useState({note: '', created: ''})

  const [addGdb, { data: mutationData }] = useMutation(ADDGDB_MUTATION)

  const {
    loading: loadingProjects,
    error: errorProjects,
    data: dataProjects
  } = useQuery(PROJECTS_QUERY)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let invalidFields = []

    // validation
    if (project === '' && nProject === '') {
      invalidFields.push('project')
    }

    if (rfaId === '') {
      invalidFields.push('rfaid')
    }

    if (description === '') {
      invalidFields.push('description')
    }

    if (invalidFields.length === 0) {
      // TODO: trim aos campos
      // TODO: rfaid to uppercase 
      // TODO: note é opcional
      const newGdb = {
        project: nProject !== '' ? nProject : project,
        rfaid: rfaId,
        description,
        status: 'Open',
        created: moment(created).toDate(),
      }

      if (note) {
        newGdb.note = note;
      }

      addGdb({variables: newGdb})
      // TODO: alertar que entrada foi criada
      // TODO: retornar para a lista
    } else {
      console.log('invalid')
    }
  }

  const handleNewProject = () => {
    setNewProject(!newProject)
    if (!newProject) {
      setNProject('')
    }
  }

  const handleProject = (e) => {
    setNewProject(false)
    setNProject('')
    setProject(e.target.value)
  }

  const handleNote = (e) => {
    let note = {
      note: e.target.value,
      created: moment(created).toDate()
    }

    setNote(note)
  }

  if (loadingProjects) return (<p>... Loading ...</p>)
  if (errorProjects) return (<p>An error occurred</p>)
  if (dataProjects && dataProjects.projects) {
    let options = []
    dataProjects.projects.forEach(p => {
      const o = {
        value: p,
        label: p
      }
      options.push(o)
    })
    return (
      <Container>
        <Content>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={firstRow}>
              <div>
                <div className='project-container'>
                  <span className='project-label'>Project</span>
                  <div>
                    <select name='projectSelect'
                      className='project-select'
                      style={{border: (!project && !nProject) ? '2px solid red' : 'none'}}
                      onChange={handleProject} >
                      <option defaultValue value=''>
                        --Select a Project
                      </option>
                      {dataProjects.projects.map(project => (
                        <option value={project} key={project}>
                          {project}
                        </option>
                        ))}
                    </select>
                    <span onClick={handleNewProject} className='newGdb'>
                      [+]
                    </span>
                    <input name='newProjectInput' style={newProject ? showNew : hideNew} onChange={(e) => setNProject(e.target.value)} value={nProject} autoComplete='off' />
                  </div>
                </div>
              </div>
              <div className='date-container'>
                <span className='date-label'>Date</span>
                <DatePicker
                  className='date-input'
                  dateFormat='dd/MM/yyyy'
                  selected={created}
                  onChange={date => console.log(date)}
                />
              </div>
            </div>
            <div>
              <span className='rfaid-label'>RFA ID</span>
              <input id='rfaid'
                style={{border: !rfaId ? '2px solid red' : 'none'}}
                className='rfaid-input'
                onChange={(e) => setRfaId(e.target.value)}
                autoComplete='off' />
            </div>
            <div className='description-container'>
              <span className='description-label'>Description</span>
              <input id='description'
                style={{border: !description ? '2px solid red' : 'none'}}
                className='description-input'
                onChange={(e) => setDescription(e.target.value)}
                autoComplete='off' />
            </div>
            <div>
              <span className='notesLabel'>Notes</span>
              <textarea id='notes' className='notesTextarea' onChange={handleNote} />
            </div>
            <button type='submit' className='btnSubmit'>
              Submit
            </button>
          </form>
        </Content>
      </Container>
    )
  }
}

export default AddGDB
