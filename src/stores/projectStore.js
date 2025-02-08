import { create } from 'zustand'
import { toast } from 'react-toastify'

const useProjectStore = create((set) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,

    // Fetch all projects
    fetchProjects: async () => {
        set({ isLoading: true })
        try {
            console.log('Fetching all projects...')
            const response = await fetch('/api/projects')
            console.log('Projects response status:', response.status)
            if (!response.ok) throw new Error('Failed to fetch projects')
            const data = await response.json()
            console.log('Received projects data:', data)
            set({ projects: data, isLoading: false })
        } catch (error) {
            console.error('Error fetching projects:', error)
            set({ error: error.message, isLoading: false })
            toast.error('Failed to fetch projects')
        }
    },

    // Fetch a single project
    fetchProject: async (projectId) => {
        set({ isLoading: true })
        try {
            console.log(`Fetching project ${projectId}...`)
            const response = await fetch(`/api/projects/${projectId}`)
            console.log('Project response status:', response.status)
            if (!response.ok) throw new Error('Failed to fetch project')
            const data = await response.json()
            console.log('Received project data:', data)
            set({ currentProject: data, isLoading: false })
        } catch (error) {
            console.error('Error fetching project:', error)
            set({ error: error.message, isLoading: false })
            toast.error('Failed to fetch project')
        }
    },

    // Create a new project
    createProject: async (projectData) => {
        set({ isLoading: true })
        try {
            console.log('Creating new project with data:', projectData)
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            })
            console.log('Create project response status:', response.status)
            if (!response.ok) throw new Error('Failed to create project')
            const data = await response.json()
            console.log('Created project data:', data)
            set(state => ({
                projects: [...state.projects, data],
                currentProject: data,
                isLoading: false
            }))
            toast.success('Project created successfully')
            return data
        } catch (error) {
            console.error('Error creating project:', error)
            set({ error: error.message, isLoading: false })
            toast.error('Failed to create project')
            return null
        }
    },

    // Update a project
    updateProject: async (projectId, projectData) => {
        set({ isLoading: true })
        try {
            console.log(`Updating project ${projectId} with data:`, projectData)
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            })
            console.log('Update project response status:', response.status)
            if (!response.ok) throw new Error('Failed to update project')
            const data = await response.json()
            console.log('Updated project data:', data)
            set(state => ({
                projects: state.projects.map(p => p.id === projectId ? data : p),
                currentProject: data,
                isLoading: false
            }))
            toast.success('Project updated successfully')
            return data
        } catch (error) {
            console.error('Error updating project:', error)
            set({ error: error.message, isLoading: false })
            toast.error('Failed to update project')
            return null
        }
    },

    // Delete a project
    deleteProject: async (projectId) => {
        set({ isLoading: true })
        try {
            console.log(`Deleting project ${projectId}...`)
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            })
            console.log('Delete project response status:', response.status)
            if (!response.ok) throw new Error('Failed to delete project')
            set(state => ({
                projects: state.projects.filter(p => p.id !== projectId),
                currentProject: null,
                isLoading: false
            }))
            toast.success('Project deleted successfully')
        } catch (error) {
            console.error('Error deleting project:', error)
            set({ error: error.message, isLoading: false })
            toast.error('Failed to delete project')
        }
    },

    // Clear current project
    clearCurrentProject: () => set({ currentProject: null }),

    // Clear all projects
    clearProjects: () => set({ projects: [], currentProject: null }),
}))

export default useProjectStore 
