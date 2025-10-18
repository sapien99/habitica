export default function toggles(user) {        
    return {    
        shops: {
            enabled: {
                market: true,
                quests: true,
                customizations: false,
                seasonal: false,
                time: false
            },
        },
        main: {
            customCreate: {
                habit: true,
                daily: false,
                todo: false,
                reward: false
            }            
        }
    }
}