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
// Gets all collections and handles the state of everything related to them (including the managers)

export const CollectionContext = createContext()

export const CollectionProvider = props => {
  const objectTypeForToasts = "collection"
  const apiUrl = "/api/collection"
  const currentUserId = +sessionStorage.getItem('currentUserId') // If 0, then anonymous, do not allow user to do anything
  const { getToken } = useContext(UserContext)

  // all collections
  const [collections, setCollections] = useState([])
  // lets program know if it needs to show a loading indicator or not
  const [isFetchingCollections, setIsFetchingCollections] = useState(true) 
  const [isFetchingCollectionDetails, setIsFetchingCollectionDetails] = useState(true)
  // currently selected collection
  const [selectedCollection, setSelectedCollection] = useState()
  // handles open states for manager and its views
  const [isCollectionManagerOpen, setIsCollectionManagerOpen] = useState(false)
  const [isCollectionCreateFormOpen, setIsCollectionCreateFormOpen] = useState(false)
  const [isCollectionDetailsOpen, setIsCollectionDetailsOpen] = useState(false)
  const [isCollectionEditFormOpen, setIsCollectionEditFormOpen] = useState(false)

  const getCollections = () => {
    if (currentUserId === 0) {
      setIsFetchingCollections(false)
    } else {
      return getToken().then(token =>
        fetch(`${apiUrl}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setIsFetchingCollections(false)
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
        .then(c => setCollections(c)))
    }
  }

  // Must do a setCollection .then AFTER you run this method
  // had to do it this way so I could set the deleteObject state
  const getCollectionById = collectionId => {
    if (currentUserId === 0) {
      setIsFetchingCollectionDetails(false)
    } else {
      return getToken().then(token =>
        fetch(`${apiUrl}/${collectionId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setIsFetchingCollectionDetails(false)
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

  const addCollection = submittedCollectionForm => {
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
            body: JSON.stringify(submittedCollectionForm)
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
        .then(collection => {
          if (collection) {
            toast.success(AddSuccess(objectTypeForToasts, submittedCollectionForm.collection.name))
            getCollections()
          } else {
            return
          }
        })
    }
  }

  const updateCollection = submittedCollectionForm => {
    if (currentUserId === 0) {
      toast.error(AnonWarning())
    } else {
      return getToken().then(token => 
        fetch(`${apiUrl}/${submittedCollectionForm.collection.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submittedCollectionForm)
        }))
        .then(res => {
          if (res.status === 204) {
            toast.success(UpdateSuccess(objectTypeForToasts))
            getCollections()
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
    <CollectionContext.Provider
      value={{
        isFetchingCollections,
        isFetchingCollectionDetails, setIsFetchingCollectionDetails,

        collections, setCollections,
        selectedCollection, setSelectedCollection,
        isCollectionManagerOpen, setIsCollectionManagerOpen,
        isCollectionCreateFormOpen, setIsCollectionCreateFormOpen,
        isCollectionDetailsOpen, setIsCollectionDetailsOpen,
        isCollectionEditFormOpen, setIsCollectionEditFormOpen,

        getCollections,
        getCollectionById,
        addCollection,
        updateCollection
      }}>
        {props.children}
    </CollectionContext.Provider>
  )
}