<script>
    let data = {
        thumbnail: "https://i.ytimg.com/vi/NOEGlhTNmts/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAI8LK5hE73HqhMkQ_7qC1HPMlq5Q",
        channelLogo: "https://yt3.googleusercontent.com/ePr4Q4DVIpU8GBSk0bAkias_6GJivzuuiHQQb804UT9eNw3BbEUWNhV9dLIjIbWf7SZbLa6tYg=s176-c-k-c0x00ffffff-no-rj",
        title: "Les tendances Design pour réussir en 2024",
        channel: "BastiUi",
        views: "2,2 k vues",
        time: "il y a 5 heures"
    }

    let displayChannel = false;
</script>

<section>
    <div class="design">
        <div class="youtube-card">
            <img src={data.thumbnail} alt="youtube video thumbnail" />
            <div class="info">
                {#if displayChannel}
                    <img src={data.channelLogo} alt="youtube channel logo" />
                {/if}
                <div>
                    <h3>{data.title}</h3>
                    <div class="meta">
                        {#if displayChannel}
                            <span>{data.channel}</span>
                        {/if}
                        <span>{data.views}ㆍ{data.time}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="config">
        <h1>Card options</h1>
        <div class="input-container">
            <input placeholder="Paste youtube video URL and hit enter" />
            <button>go</button>
        </div>

        <input type="checkbox" bind:checked={displayChannel} />
    </div>
</section>

<style lang="scss">
    section{
        display: grid;
        max-width: 1280px;
        grid-template-columns: 1fr 400px;
        gap: 1.5rem;
        margin: 0 auto;

        .design{
            background-color: red;
            display:flex;
            flex-direction: column;

            aspect-ratio: 1 / 0.875;
            transform: scale(1);
            background-image: linear-gradient(to right bottom, rgb(138, 189, 242) 0%, rgb(138, 189, 242) 100%);
            align-items: center;
            justify-content: center;
            border-radius: .75rem;

            .youtube-card{
                max-width: min(100%, 400px);
                background-color: white;
                border-radius: 1rem;
                box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
                margin: 1rem;
                padding: 1rem;  
                //aspect-ratio: 16 / 12;

                & > img{
                    width: 100%;
                    border-radius: .5rem;
                    aspect-ratio: 16 / 9;
                
                }

                .info{
                    //margin: 0 12px;
                    flex: auto;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;

                    .meta{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;   
                        color: #606060;    
                        
                        font-family: "Roboto", "Arial", sans-serif;
                        font-size: 1rem;
                        line-height: 1.5rem;
                        font-weight: 400;
                    }

                    img{
                        height: 45px;
                        margin-top: 12px;
                        margin-right: 12px;
                        border-radius: 50%;
                    }

                    h3{
                        margin: 12px 0 4px 0;
                        text-overflow: ellipsis;
                        color: #0f0f0f;
                    }
                }
            }
        }

        .config{
            display:flex;
            flex-direction: column;
            background-color: rgb(29 29 29);
            //max-height: calc(100vh - 215px);
            overflow-y: auto;

            border-color: rgb(38 38 38);
            border-width: 1px;
            border-radius: .75rem;

            h1{
                background-color: rgb(23 23 23);
                color: rgb(115 115 115 );
                padding: 0.25rem 1rem;
                margin: 0;
                font-size: .875rem;
                line-height: 1.25rem;
                text-align: center;
            }

            .input-container{
                padding: 0.5rem 1rem;

                input{
                    background-color: rgba(38, 38, 38, .5);
                    //border-color: #e5e5e5
                    box-sizing: border-box;
                    border: 1px solid #e5e5e5;

                    outline: 2px solid transparent;
                    outline-offset: 2px;

                    width: 100%;
                    box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);

                    margin-top: .25rem;
                    margin-bottom: .25rem;
                    border-radius: .5rem;

                    padding: 6px .75rem; 
                }
            }
        }
    }
</style>
