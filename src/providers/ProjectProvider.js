import React, { createContext, useState, useContext } from 'react'
import { UserContext } from "./UserProvider"
import { toast } from 'react-toastify'
import {
  AnonWarning,
  DbNoConnection,
  RetrieveFailure,
  AddFailure,
  AddSuccess,
  FailureNameDupe,
  UpdateSuccess,
  UpdateFailure, } from '../utils/ToastMessages'
// Gets all projects and handles the state of everything related to them (including the managers)

export const ProjectContext = createContext()

export const ProjectProvider = props => {
  const objectTypeForToasts = "project"
  const apiUrl = "/api/project"
  const currentUserId = +sessionStorage.getItem('currentUserId') // If 0, then anonymous, do not allow user to do anything
  const { getToken } = useContext(UserContext)

  // all projects
  const [projects, setProjects] = useState([])
  // lets program know if it needs to show a loading indicator or not
  const [isFetchingProjects, setIsFetchingProjects] = useState(true) 
  const [isFetchingProjectDetails, setIsFetchingProjectDetails] = useState(true)
  // currently selected Project
  const [selectedProject, setSelectedProject] = useState()
  // handles open states for manager and its views
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false)
  const [isProjectCreateFormOpen, setIsProjectCreateFormOpen] = useState(false)
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false)
  const [isProjectEditFormOpen, setIsProjectEditFormOpen] = useState(false)
  
  const getProjects = () => {
    if (currentUserId === 0) {
      setIsFetchingProjects(false)
    } else {
      return getToken().then(token =>
        fetch(`${apiUrl}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setIsFetchingProjects(false)
          if (res.status === 500) {
            toast.error(DbNoConnection())
            return
          }
          if (res.status === 404) {
            toast.error(RetrieveFailure(`${objectTypeForToasts}s`))
            return
          }
          return res.json()
        })
        .then(p => setProjects(p)))
    }
  }

  // Must do a setProject .then AFTER you run this method
  // had to do it this way so I could set the deleteObject state
  const getProjectById = (projectId) => {
    if (currentUserId === 0) {
      setIsFetchingProjectDetails(false)
    } else {
      return getToken().then(token =>
        fetch(`${apiUrl}/${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setIsFetchingProjectDetails(false)
          if (res.status === 500) {
            toast.error(DbNoConnection())
          }
          if (res.status === 404) {
            toast.error(RetrieveFailure(objectTypeForToasts))
          }
          return res.json()
        }))
    }
  }

  const addProject = submittedProjectForm => {
    if (currentUserId === 0) {
      toast.error(AnonWarning())
    } else {
      return getToken().then(token => 
        fetch(apiUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submittedProjectForm)
        }))
        .then(res => {
          if (res.status === 200) {
            // Working well!
            return res.json()
          }
          if (res.status === 500) {
            // Not connected to Db
            toast.error(DbNoConnection())
            return
          }
          if (res.status === 400) {
            // Bad request
            toast.error(FailureNameDupe(objectTypeForToasts))
            return
          }      
          if (res.status === 404) {
            // Not found
            toast.error(AddFailure(objectTypeForToasts))
            return
          }      
        })
        .then(project => {
          if (project) {
            toast.success(AddSuccess(objectTypeForToasts, submittedProjectForm.project.name))
            getProjects()
          } else {
            return
          }
        })
    }
  }

  const updateProject = submittedProjectForm => {
    if (currentUserId === 0) {
      toast.error(AnonWarning())
    } else {
      return getToken().then(token => 
        fetch(`${apiUrl}/${submittedProjectForm.project.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submittedProjectForm)
        }))
        .then(res => {
          if (res.status === 204) {
            toast.success(UpdateSuccess(objectTypeForToasts))
            getProjects()
            return true
          }
          if (res.status === 500) {
            // Not connected to Db
            toast.error(DbNoConnection())
            return false
          }
          if (res.status === 401) {
            // Bad request
            toast.error(FailureNameDupe(objectTypeForToasts))
            return false
          }
          if (res.status === 404) {
            // Not found
            toast.error(UpdateFailure(objectTypeForToasts))
            return false
          }      
        })
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        isFetchingProjects,
        isFetchingProjectDetails, setIsFetchingProjectDetails,

        projects, setProjects,
        selectedProject, setSelectedProject,
        isProjectManagerOpen, setIsProjectManagerOpen,
        isProjectCreateFormOpen, setIsProjectCreateFormOpen,
        isProjectDetailsOpen, setIsProjectDetailsOpen,
        isProjectEditFormOpen, setIsProjectEditFormOpen,

        getProjects,
        getProjectById,
        addProject,
        updateProject
      }}>
        {props.children}
    </ProjectContext.Provider>
  )
}