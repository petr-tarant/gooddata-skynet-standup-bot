import { request } from 'https';

/**
 * Gets the next moderator using a simple rotation system based on day of month
 * 
 * @param {Array} teamMembers - Array of team member IDs
 * @returns {string} - The selected team member ID
 */
function getNextModerator(teamMembers) {
  // Calculate today's date
  const today = new Date();
  const dayOfMonth = today.getDate(); // 1-31
  
  // Use modulo to cycle through team members based on day of month
  // Subtract 1 from dayOfMonth to get 0-based index
  const index = (dayOfMonth - 1) % teamMembers.length;
  
  // Return the team member at the calculated index
  return teamMembers[index];
}

/**
 * Sends the daily standup notification to Slack
 */
function sendStandupNotification() {
    // Get webhook path from environment variable
    const webhookPath = process.env.SLACK_WEBHOOK_PATH;
    
    if (!webhookPath) {
        console.error("Error: SLACK_WEBHOOK_PATH environment variable is not set");
        process.exit(1);
    }

    // list of public holidays in Czech Republic (MM-DD)
    // http://svatky.centrum.cz/svatky/statni-svatky/
    const publicHolidays = [
        "01-01", // novy rok
        "04-03", // velky patek (NEEDS TO BE CHANGED YEARLY!)
        "04-06", // velikonocni pondeli (NEEDS TO BE CHANGED YEARLY!)
        "05-01", // svatek prace
        "05-08", // den vitezstvi
        "07-05", // Cyril a Metodej
        "07-06", // Jan Hus
        "09-28", // Den ceske statnosti
        "10-28", // Den vzniku samostatneho ceskoslovenska
        "11-17", // Den boje za svobodu, etc.
        "12-24", // Stedry den
        "12-25", // 1. svatek vanocni
        "12-26", // 2. svatek vanocni
        "12-28", // PTO5
        "12-29", // PTO5
        "12-30", // PTO5
        "12-31", // PTO5
    ];

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${month}-${day}`;

    const isPublicHoliday = publicHolidays.some((holiday) => holiday === todayString);

    if (isPublicHoliday) {
        console.log("No message send because today is a day of public holidays. Yay!");
        return;
    }

    const teamMembers = [
        "U3B6WKA57",    //Petr Tarant
        "U8CCJLR42",    //Ondrej Macek
        "U8X28E25Q",    //Tomas Muchka
        "U026KDFKEV7",   //Andrii 
        "U08D4QBD3HV",  //Jakub Svehla
        "U08J8CYUJ12",   //Jakub Zovak
        "U02FE0UQWPM",   //Jan Kadlec
        "U08DK98UY4B",   //Marcelo
        "U0920FWFR97",   //Vojtech Bartos
        "U026TUKM89Z",   //Stanislav Hacker
    ];

    // Get next moderator using the simple rotation system
    const nextModeratorId = getNextModerator(teamMembers);
    const teamMember = `<@${nextModeratorId}>`;

    const messages = [
        // All F1-themed messages with easy language for non-native speakers
        `LIGHTS OUT AND AWAY WE GO! ${teamMember} is today's standup leader! Time to share your progress!`,
        
        `${teamMember} is in the driver's seat for today's standup! Everyone, start your engines and prepare your updates!`,
        
        `Today's standup will be as fast as an F1 pit stop, with ${teamMember} as our pit crew chief!`,
        
        `Ready, set, go! ${teamMember} is leading our Team F1 standup today. Let's make it a quick race!`,
        
        `${teamMember} takes the wheel for today's standup! No need for a safety car - we'll have a smooth meeting.`,
        
        `Like a champion F1 driver, ${teamMember} will guide us through today's standup with skill and precision!`,
        
        `Victory lap time! ${teamMember} is the winning choice to lead our standup today.`,
        
        `${teamMember} is on pole position to lead our standup. Everyone else, line up on the starting grid!`,
        
        `Zoom zoom! ${teamMember} is racing ahead to be our standup moderator today. Who will finish their updates first?`,
        
        `The checkered flag goes to ${teamMember} for being today's standup leader! Let's make this meeting a winner!`,
        
        `${teamMember} is fueled up and ready to lead today's standup race! Don't worry about pit stops - this will be quick!`,
        
        `The trophy goes to ${teamMember} for being brave enough to lead our standup Grand Prix today!`,
        
        `${teamMember} is driving the pace car for our standup today. Follow their lead for a perfect formation!`,
        
        `Our standup circuit champion today is ${teamMember}! They'll help us navigate all the turns and straightaways of our project.`,
        
        `${teamMember} has the green light to start our standup. Everyone else, prepare to zoom through your updates!`,
        
        `${teamMember} has the fastest lap time and wins the honor of leading today's standup!`,
        
        `Race day! ${teamMember} will be our lead driver for the standup Grand Prix!`,
        
        `The podium today belongs to ${teamMember} as our standup facilitator. Gold medal performance expected!`,
        
        `${teamMember} is wearing the yellow jersey as our standup leader today! Wait, that's the wrong sport... they're in the driver's seat!`,
        
        `${teamMember} is our F1 standup champion today! No tire changes needed, just straight racing to the finish line!`,
        
        `Today's weather forecast for our standup: clear skies, dry track, and ${teamMember} in control of the race!`,
        
        `${teamMember} qualified with the fastest time and earned the right to lead today's standup race!`,
        
        `${teamMember} is monitoring race control for today's standup. Keep your updates short like a quick pit stop!`,
        
        `Engine check, tire check, radio check - all systems go! ${teamMember} is ready to start our standup!`,
        
        `${teamMember} is in first position on the grid for today's standup. Everyone get ready for a flying start!`
    ];

    // Pick one message at random using the original getRandomItem function
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    const data = JSON.stringify({
        text: `<!here> ${getRandomItem(messages)}`
    });

    const options = {
        hostname: 'hooks.slack.com',
        port: 443,
        path: webhookPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', d => {
            process.stdout.write(d);
        });
    });

    req.on('error', error => {
        console.error(error);
        process.exit(1);
    });

    req.write(data);
    req.end();

    console.log("The daily standup facilitator notification send to slack");
}

// Execute the notification
sendStandupNotification();
