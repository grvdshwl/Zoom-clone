# System Design - Zoom Clone


### Requirements

1. The video conferencing app must allow one-to-one and group calls.
2. The video conferencing app must support large group calls with up to 100 users.
3. We should be able to record the calls and upload them to the cloud.






# TCP vs UDP

## Full Forms

- **TCP**: Transmission Control Protocol
- **UDP**: User Datagram Protocol

## Comparison Table

| Feature             | TCP                                            | UDP                                      |
|---------------------|------------------------------------------------|------------------------------------------|
| **Connection Type** | Connection-oriented                            | Connectionless                           |
| **Reliability**     | Reliable, guarantees delivery and order        | Unreliable, no delivery or order guarantee|
| **Flow Control**    | Yes                                            | No                                       |
| **Congestion Control** | Yes                                        | No                                       |
| **Error Checking**  | Yes, with error correction                     | Yes, but no error correction             |
| **Overhead**        | Higher                                         | Lower                                    |
| **Use Cases**       | Web browsing, file transfers, email            | Live streaming, online gaming, VoIP      |

## Detailed Explanation

### 1. Connection Type
- **TCP (Transmission Control Protocol)**: A connection-oriented protocol that establishes a connection through a three-way handshake process before data can be transmitted.
- **UDP (User Datagram Protocol)**: A connectionless protocol that sends data without establishing a connection first.

### 2. Reliability
- **TCP**: Ensures reliable data transmission. It guarantees that data is delivered correctly, in order, and without loss. If packets are lost or corrupted, TCP retransmits them.
- **UDP**: Does not guarantee delivery or order. Packets may be lost, duplicated, or delivered out of order, and there is no mechanism for retransmission.

### 3. Flow Control
- **TCP**: Manages the rate of data transmission between sender and receiver to prevent overwhelming the receiver.
- **UDP**: Does not manage data flow between sender and receiver. The sender can send data at any rate.

### 4. Congestion Control
- **TCP**: Implements congestion control to adjust the transmission rate based on network traffic to avoid congestion.
- **UDP**: Lacks congestion control mechanisms. It sends data at a constant rate regardless of network conditions.

### 5. Error Checking
- **TCP**: Performs error checking using checksums and ensures data integrity through acknowledgments and retransmissions.
- **UDP**: Includes error checking with checksums but does not ensure data correction or retransmission.

### 6. Overhead
- **TCP**: Has higher overhead due to connection establishment, error checking, flow control, and congestion control mechanisms.
- **UDP**: Has lower overhead due to its simpler, connectionless nature.

### 7. Use Cases
- **TCP**: Suitable for applications where reliable data transfer is crucial, such as web browsing (HTTP/HTTPS), file transfers (FTP), and email (SMTP).
- **UDP**: Ideal for applications where speed is more important than reliability, such as live streaming, online gaming, and VoIP.

# Network Address Translation (NAT)

Network Address Translation (NAT) is a method used in computer networking to remap one IP address space into another. It allows multiple devices within a local network to share a single public IP address allocated by an ISP.

## How NAT Works

1. **Private vs. Public IP Addresses**:
   - **Private IP Addresses**: Used within a local network (e.g., 192.168.x.x) and not routable over the Internet.
   - **Public IP Addresses**: Routable over the Internet and uniquely identify devices.

2. **Translation Process**:
   - **Outbound Traffic**: NAT replaces the source IP address and port number of outgoing packets with its own public IP address and a dynamically assigned port number (Source NAT or PAT).
   - **Inbound Traffic**: NAT uses port numbers to forward incoming packets to the correct internal device.

3. **Types of NAT**:
   - **Static NAT**: Maps a private IP address to a specific public IP address.
   - **Dynamic NAT**: Maps private IP addresses to a pool of public IP addresses.
   - **PAT (Port Address Translation)**: Maps multiple private IP addresses to a single public IP address using different port numbers.

4. **Advantages**:
   - **Address Conservation**: Allows many devices to share a smaller pool of public IP addresses.
   - **Enhanced Security**: Hides internal network structures and IP addresses from the Internet.

5. **Challenges**:
   - **Limitations**: Complicates hosting services like peer-to-peer applications or servers requiring external access.

## Use Cases

- **Home Networks**: Allows multiple devices in a home network to share a single public IP address.
- **Corporate Networks**: Efficiently manages internal network addressing and enhances security.
- **ISPs**: Maximizes the use of public IP address

#  (Peer-to-Peer Communication)

In theory, the fastest way for two devices to communicate is directly with one another! However, is this always the optimal choice? Probably not.

- In a large group chat, each participant would need to send and receive video from multiple sources.
- Handling recording in such scenarios becomes complex.

#### For a one-on-one call, how can we achieve peer-to-peer communication effectively?

### Conclusion - To Figure out a client private IP address, we may need to contact a STUN server however depending on NAT device STUN server may also not work and not provide Private IP addresses.So, Peer to Peer Communication may not work

## Solution Two
# Central Chat Server

**Main benefit**: Each client only has to listen to/send video to one place!

**Main con**: The server is under a lot of load.

### Option 1:
- The central server takes in all streams, compiles them down to one video source, and sends it to all clients.

**Issues**:
- Lots of processing work on the server to merge videos together.
- Each client has to watch the same stream.

### Improvement Strategies:
How can we improve this?

## Option 3 (Selective Forwarding)

#### Only send clients streams they care about and in the appropriate resolutions

- Use a websocket from client to server where servers caches wht client wants.


# Options for Sending Footage from the Client

## 1. Client sends one stream to central server
- **Pros:**
  - Client only has to send one stream
- **Cons:**
  - Server has to convert the stream to other resolutions, causing a lot of load

## 2. Client sends one stream to intermediary server which does encoding
- **Pros:**
  - Client only has to send one stream, reducing load on central server
- **Cons:**
  - Additional networking latency

## 3. Client does encoding(web RTC) and sends multiple streams to central server (used in practice)

- **Pros:**
  - No extra servers required
  - No extra load on the main server
- **Cons:**
  - More work for the client device


# Partitioning and Replication

## Partitioning
- **Use consistent hashing to shard chat servers by chat ID**
  - Assign call to a server on call creation
  - Use 2 or 3 chat servers for expensive calls; each client sends to one and listens to all (consistent hashing to map user ID to chat ID)

## Replication
- **Each client listens to Zookeeper**
  - If a chat server goes down, perform a failover to a passive backup
  - No need to keep any state on the backup; each client can specify which streams they want on reconnect


# Video Recording

Expensive to do on a central server, so let's offload it!

- **Solution: Have other servers subscribe to the video call**
  - This allows for distribution of the recording load.
  - If we only need one recording with a couple of video streams at a time (e.g., the active speaker):
    - This approach can efficiently manage resources by recording only the necessary streams.


# Final Diagram

![Alt text](<design.png>)