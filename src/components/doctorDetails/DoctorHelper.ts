export const isSlotTimePassed = (slotTime: string, slotDate?: string): boolean => {
    if (!slotTime) return false

    const now = new Date()

    if (slotDate) {
        const parts = slotDate.split('-')
        if (parts.length === 3) {
            const slotYear = parseInt(parts[0], 10)
            const slotMonth = parseInt(parts[1], 10) - 1
            const slotDay = parseInt(parts[2], 10)

            const todayYear = now.getFullYear()
            const todayMonth = now.getMonth()
            const todayDay = now.getDate()

            const slotDateObj = new Date(slotYear, slotMonth, slotDay)
            const todayObj = new Date(todayYear, todayMonth, todayDay)

            if (slotDateObj < todayObj) {
                return true
            }
            if (slotDateObj > todayObj) {
                return false
            }
        }
    }

    let hours = 0
    let minutes = 0

    const cleanTime = slotTime.trim()
    const isPM = /PM/i.test(cleanTime)
    const isAM = /AM/i.test(cleanTime)

    const timeMatches = cleanTime.replace(/(AM|PM)/i, '').trim().split(':')
    if (timeMatches.length >= 2) {
        hours = parseInt(timeMatches[0], 10)
        minutes = parseInt(timeMatches[1], 10)

        if (isPM && hours < 12) {
            hours += 12
        } else if (isAM && hours === 12) {
            hours = 0
        }
    } else {
        return false
    }

    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()

    if (hours < currentHours) {
        return true
    } else if (hours === currentHours) {
        return minutes <= currentMinutes
    }

    return false
}


export const formatDateString = (dateStr: string): string => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1
        const day = parseInt(parts[2], 10)
        const d = new Date(year, month, day)
        if (!isNaN(d.getTime())) {
            const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' })
            const monthName = d.toLocaleDateString('en-US', { month: 'short' })
            return `${dayOfWeek}, ${day} ${monthName}`
        }
    }
    return dateStr
}

export const formatTimeString = (timeStr: string): string => {
    if (!timeStr) return ''
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr

    const parts = timeStr.trim().split(':')
    if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10)
        const minutes = parts[1]
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12 || 12
        return `${hours}:${minutes} ${ampm}`
    }
    return timeStr
}