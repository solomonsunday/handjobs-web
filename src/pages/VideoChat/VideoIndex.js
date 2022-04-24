import React from 'react';
import VideoChat from './VideoChat';

import './VideoStyles.css';

const VideoIndex = () => {
    return (
        <div className="app">
            <header>
                <h1>Jobplicant Video Call</h1>
            </header>
            <main>
                <VideoChat />
            </main>
            <footer>
                <p>
                    Made with{' '}
                    <span role="img" aria-label="React">
                        ⚛
                    </span>{' '}
                    by <a href="https://twitter.com/philnash">philnash</a>
                </p>
            </footer>
        </div>
    );
};

export default VideoIndex;