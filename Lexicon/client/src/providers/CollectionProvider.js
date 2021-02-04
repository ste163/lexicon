import React, { createContext, useState, useContext } from 'react'
import { UserContext } from "./UserProvider"
import { toast } from 'react-toastify'
import {
  AnonWarning,
  DbNoConnection,
  CollectionRetrieveFailure,
  CollectionAddFailure,
  CollectionAddSuccess,
  CollectionFailureNameDupe,
  CollectionUpdateSuccess,
  CollectionUpdateFailure, } from '../utils/ToastMessages'

export const CollectionContext = createContext()

export const CollectionProvider = props => {
  const apiUrl = "/api/collection"
  const currentUserId = +sessionStorage.getItem('currentUserId') // If 0, then anonymous, do not allow user to do anything
  const { getToken } = useContext(UserContext)

  // all collections
  const [collections, setCollections] = useState()
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
          }
          if (res.status === 404) {
            toast.error(CollectionRetrieveFailure())
          }
          return res.json()
        })
        .then(c => setCollections(c)))
    }
  }

  // Must do a setCollection .then AFTER you run this method
  // had to do it this way so I could set the deleteObject state
  const getCollectionById = (collectionId) => {
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
            toast.error(CollectionRetrieveFailure())
          }
          return res.json()
        }))
    }
  }

  const addCollection = submittedCollection => {
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
            body: JSON.stringify(submittedCollection)
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
            toast.error(CollectionFailureNameDupe())
            return
          }      
          if (res.status === 404) {
            // Not found
            toast.error(CollectionAddFailure())
            return
          }      
        })
        .then(collection => {
          if (collection) {
            toast.success(CollectionAddSuccess(collection.name))
            getCollections()
          } else {
            return
          }
        })
    }
  }
  
  const updateCollection = submittedCollection => {
    if (currentUserId === 0) {
      toast.error(AnonWarning())
    } else {
      return getToken().then(token => 
        fetch(`${apiUrl}/${submittedCollection.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submittedCollection)
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
            toast.error(CollectionFailureNameDupe())
            return
          }      
          if (res.status === 404) {
            // Not found
            toast.error(CollectionUpdateFailure())
            return
          }      
        })
        .then(collection => {
          if (collection) {
            toast.success(CollectionUpdateSuccess(collection.name))
            getCollections()
          } else {
            return
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