const data = `{
    "text": "Metallica",
    "xAxis": {
        "text": "Releases",
        "scaleJump": 1,
        "scales": null,
        "elements": [
            {
                "text": "Kill 'Em All",
                "timespans": [
                    {
                        "start": "1983-07-25",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Ride the Lightning",
                "timespans": [
                    {
                        "start": "1984-07-27",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Master of Puppets",
                "timespans": [
                    {
                        "start": "1986-02-24",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Garage Days Re-Revisited",
                "timespans": [
                    {
                        "start": 1987,
                        "category": "EP"
                    }
                ]
            },
            {
                "text": "...And Justice for All",
                "timespans": [
                    {
                        "start": "1988-08-25",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "The $5.98 E.P.: Garage Days Re-Revisited",
                "timespans": [
                    {
                        "start": 1988,
                        "category": "EP"
                    }
                ]
            },
            {
                "text": "Metallica",
                "timespans": [
                    {
                        "start": "1991-08-12",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Load",
                "timespans": [
                    {
                        "start": "1996-06-04",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Reload",
                "timespans": [
                    {
                        "start": "1997-11-18",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Garage Inc.",
                "timespans": [
                    {
                        "start": 1998,
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "S&M",
                "timespans": [
                    {
                        "start": 1999,
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "St. Anger",
                "timespans": [
                    {
                        "start": "2003-06-05",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Death Magnetic",
                "timespans": [
                    {
                        "start": "2008-09-12",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Hardwired...To Self-Destruct",
                "timespans": [
                    {
                        "start": "2016-11-18",
                        "category": "Album"
                    }
                ]
            },
            {
                "text": "Lords of Summer",
                "timespans": [
                    {
                        "start": 2014,
                        "category": "Single"
                    }
                ]
            }
        ]
    },
    "yAxis": {
        "text": "Members",
        "elements": [
            {
                "text": "James Hetfield",
                "position": 0,
                "timespans": [
                    {
                        "start": 1981,
                        "category": "Lead Vocals",
                        "priority": 0
                    },
                    {
                        "start": 1981,
                        "category": "Rhythm Guitar",
                        "priority": 1
                    }
                ]
            },
            {
                "text": "Lars Ulrich",
                "position": 1,
                "timespans": [
                    {
                        "start": 1981,
                        "category": "Drums"
                    }
                ]
            },
            {
                "text": "Kirk Hammett",
                "position": 2,
                "timespans": [
                    {
                        "start": 1983,
                        "category": "Lead Guitar"
                    }
                ]
            },
            {
                "text": "Jason Newstead",
                "position": 3,
                "timespans": [
                    {
                        "start": 1986,
                        "end": 2001,
                        "category": "Bass Guitar"
                    }
                ]
            },
            {
                "text": "Dave Mustaine",
                "position": 4,
                "timespans": [
                    {
                        "start": 1981,
                        "end": 1983,
                        "category": "Lead Guitar"
                    }
                ]
            },
            {
                "text": "Cliff Burton",
                "position": 5,
                "timespans": [
                    {
                        "start": 1982,
                        "end": 1986,
                        "category": "Bass Guitar"
                    }
                ]
            },
            {
                "text": "Robert Trujillo",
                "position": 6,
                "timespans": [
                    {
                        "start": 2003,
                        "category": "Bass Guitar"
                    }
                ]
            },
            {
                "text": "Ron McGovney",
                "position": 7,
                "timespans": [
                    {
                        "start": 1982,
                        "end": 1983,
                        "category": "Bass Guitar"
                    }
                ]
            }
        ]
    },
    "categories": [
        {
            "category": "Lead Vocals",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#FF0099",
                    "style": ""
                }
            ]
        },
        {
            "category": "Lead Guitar",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#00CC00",
                    "style": ""
                }
            ]
        },
        {
            "category": "Bass Guitar",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#E6E600",
                    "style": ""
                }
            ]
        },
        {
            "category": "Rhythm Guitar",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#6600CC",
                    "style": ""
                },
                {
                    "priority": 1,
                    "colour": "#669933",
                    "style": ""
                }
            ]
        },
        {
            "category": "Drums",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#0099FF",
                    "style": ""
                }
            ]
        },
        {
            "category": "Album",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#993399",
                    "style": ""
                }
            ]
        },
        {
            "category": "EP",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#006633",
                    "style": ""
                }
            ]
        },
        {
            "category": "Single",
            "appearances": [
                {
                    "priority": 0,
                    "colour": "#CC9900",
                    "style": ""
                }
            ]
        }
    ]
}`;