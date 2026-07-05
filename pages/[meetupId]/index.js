import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetailsPage(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetupDetail 
            image={props.meetupData.image} 
            title={props.meetupData.title}
            address={props.meetupData.address} 
            description={props.meetupData.description}/>
        </Fragment>
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();
    
    return {
        paths: meetups.map(meetup => ({
            params: { meetupId: meetup._id.toString() }
        })),
        fallback: 'blocking'
    };
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(process.env.MONGODB_URI);

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) });

    selectedMeetup._id = selectedMeetup._id.toString();

    client.close();

    return {
        props: {
            meetupData: selectedMeetup
        }
    };
}

export default MeetupDetailsPage;