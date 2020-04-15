import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DatePicker from 'react-datepicker'
import moment from 'moment'

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

const Gdb = (props) => {  
  const { gdb } = props.location.state;
  console.log(gdb)
    return (
      <Container>
        <Content>
          <form style={formStyle}>
            <div style={firstRow}>
              <div>
                <div className='project-container'>
                  <span className='project-label'>Project</span>
                  <div>
                    <select name='projectSelect'
                      className='project-select'
                      disabled
                      >
                      <option value={gdb.project}>
                        {gdb.project}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='date-container'>
                <span className='date-label'>Date</span>
                <DatePicker
                  className='date-input'
                  dateFormat='dd/MM/yyyy'
                  value={moment(gdb.created).format('DD/MM/YYYY')}
                />
              </div>
            </div>
            <div>
              <span className='rfaid-label'>RFA ID</span>
              <input id='rfaid'
                className='rfaid-input'
                autoComplete='off' 
                readonly
                value={gdb.rfaid}
                />
            </div>
            <div className='description-container'>
              <span className='description-label'>Description</span>
              <input id='description'
                className='description-input'
                autoComplete='off'
                value={gdb.description}
                readonly
                />
            </div>
            <div>
              <span className='notesLabel'>Notes <span className='newGdb'>[+]</span></span>
              { gdb.notes.map(note => {
                const value = `${moment(note.created).format('DD/MM/YYYY')}
${note.note}

--------------------------------------------

                `
                return <textarea id='notes' className='notesTextarea' readonly value={value} key={note.created}/>
              }
              )}
            </div>
            <button type='submit' className='btnSubmit'>
              Save
            </button>
          </form>
        </Content>
      </Container>
    )
  }

export default Gdb
